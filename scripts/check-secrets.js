const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");

const ignoredPathPatterns = [
  /^\.git\//,
  /^node_modules\//,
  /^\.next\//,
  /^\.vercel\//,
  /^dist\//,
  /^build\//,
  /^coverage\//,
  /^test-results\//,
  /^playwright-report\//,
  /^\.env$/,
  /^\.env\.local$/,
  /^\.env\.production$/,
  /^\.env\.development$/,
  /^\.env\.development\.local$/,
  /^\.env\.test\.local$/,
  /^\.env.*\.local$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^yarn\.lock$/
];

const secretPatterns = [
  { name: "Stripe secret key", pattern: /\bsk_(?:test|live)_[A-Za-z0-9]{10,}\b/g },
  { name: "Stripe restricted key", pattern: /\brk_(?:test|live)_[A-Za-z0-9]{10,}\b/g },
  { name: "Stripe webhook secret", pattern: /\bwhsec_[A-Za-z0-9]{10,}\b/g },
  { name: "Private key block", pattern: new RegExp("BEGIN " + "PRIVATE KEY", "g") }
];

const sensitiveEnvNames = [
  "OPENAI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET"
];

function normalizePath(file) {
  return file.replaceAll("\\", "/");
}

function candidateFiles() {
  return execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => !ignoredPathPatterns.some((pattern) => pattern.test(normalizePath(file))));
}

function isSafePlaceholder(value) {
  const normalized = value.trim().replace(/^["']|["']$/g, "");
  return (
    normalized === "" ||
    normalized === "..." ||
    normalized.endsWith("...") ||
    normalized.includes("example") ||
    normalized.includes("placeholder") ||
    normalized.startsWith("test-") ||
    normalized.includes("test-only") ||
    normalized.includes("dummy")
  );
}

function scanEnvAssignment(file, line, lineNumber, findings) {
  for (const envName of sensitiveEnvNames) {
    const match = line.match(new RegExp(`^\\s*${envName}\\s*=\\s*(.*)\\s*$`));
    if (!match) continue;

    const value = match[1] || "";
    if (!isSafePlaceholder(value)) {
      findings.push({ file, lineNumber, label: `${envName} com valor possivelmente real` });
    }
  }
}

function scanPrivateKeyAssignment(file, line, lineNumber, findings) {
  const match = line.match(/\bprivate_key\b\s*[:=]\s*["']?([^"',}]+)/i);
  if (!match) return;

  if (!isSafePlaceholder(match[1] || "")) {
    findings.push({ file, lineNumber, label: "private_key com valor possivelmente real" });
  }
}

function scanFile(file, findings) {
  let content;

  try {
    content = readFileSync(file, "utf8");
  } catch {
    return;
  }

  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    scanEnvAssignment(file, line, lineNumber, findings);
    scanPrivateKeyAssignment(file, line, lineNumber, findings);

    for (const { name, pattern } of secretPatterns) {
      pattern.lastIndex = 0;
      for (const match of line.matchAll(pattern)) {
        if (!isSafePlaceholder(match[0])) {
          findings.push({ file, lineNumber, label: name });
        }
      }
    }
  });
}

const findings = [];

for (const file of candidateFiles()) {
  scanFile(file, findings);
}

if (findings.length > 0) {
  console.error("Possiveis secrets encontrados em arquivos versionados:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.lineNumber} (${finding.label})`);
  }
  process.exit(1);
}

console.log("Nenhum secret obvio encontrado em arquivos versionados.");
