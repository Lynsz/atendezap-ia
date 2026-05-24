import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ignoredPathPatterns = [
  /^\.git\//,
  /^\.next\//,
  /^node_modules\//,
  /^\.env$/,
  /^\.env\.local$/,
  /^\.env\.production$/,
  /^\.env\.development\.local$/,
  /^\.env\.test\.local$/,
  /^\.env.*\.local$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^yarn\.lock$/
];

const secretPatterns = [
  { name: "Stripe secret key", pattern: /\bsk_(test|live)_[A-Za-z0-9]{10,}\b/g },
  { name: "Stripe publishable key", pattern: /\bpk_(test|live)_[A-Za-z0-9]{10,}\b/g },
  { name: "Stripe restricted key", pattern: /\brk_(test|live)_[A-Za-z0-9]{10,}\b/g },
  { name: "Stripe webhook secret", pattern: /\bwhsec_[A-Za-z0-9]{10,}\b/g },
  { name: "JWT-like token", pattern: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\b/g }
];

const sensitiveEnvAssignments = [
  "OPENAI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_RESTRICTED_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SENTRY_AUTH_TOKEN",
  "UPSTASH_REDIS_REST_TOKEN",
  "KIWIFY_WEBHOOK_SECRET"
];

function trackedFiles() {
  return execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => !ignoredPathPatterns.some((pattern) => pattern.test(file.replaceAll("\\", "/"))));
}

function isPlaceholder(value) {
  const normalized = value.trim();
  return (
    normalized === "" ||
    normalized === "..." ||
    normalized.endsWith("...") ||
    normalized.includes("example") ||
    normalized.includes("dummy") ||
    normalized.includes("test-only") ||
    normalized.includes("placeholder")
  );
}

function scanEnvAssignment(file, line, lineNumber, findings) {
  for (const envName of sensitiveEnvAssignments) {
    const match = line.match(new RegExp(`^\\s*${envName}\\s*=\\s*(.+?)\\s*$`));
    if (!match) continue;

    const value = match[1].replace(/^["']|["']$/g, "");
    if (!isPlaceholder(value)) {
      findings.push({ file, lineNumber, label: `${envName} has a committed value` });
    }
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

    for (const { name, pattern } of secretPatterns) {
      pattern.lastIndex = 0;
      const matches = [...line.matchAll(pattern)].filter((match) => !isPlaceholder(match[0]));
      if (matches.length > 0) {
        findings.push({ file, lineNumber, label: name });
      }
    }
  });
}

const findings = [];

for (const file of trackedFiles()) {
  scanFile(file, findings);
}

if (findings.length > 0) {
  console.error("Possiveis segredos encontrados em arquivos versionados:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.lineNumber} (${finding.label})`);
  }
  process.exit(1);
}

console.log("Nenhum padrao de segredo real encontrado em arquivos versionados.");
