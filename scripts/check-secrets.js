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
  { name: "OpenAI API key", pattern: /\bsk-(?:proj|svcacct)-[A-Za-z0-9_-]{20,}\b/g },
  { name: "Stripe secret key", pattern: /\bsk_(?:test|live)_[A-Za-z0-9]{10,}\b/g },
  { name: "Stripe restricted key", pattern: /\brk_(?:test|live)_[A-Za-z0-9]{10,}\b/g },
  { name: "Stripe webhook secret", pattern: /\bwhsec_[A-Za-z0-9]{10,}\b/g },
  { name: "JWT-like token", pattern: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\b/g },
  { name: "GitHub token", pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/g },
  { name: "GitHub fine-grained token", pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { name: "Vercel token", pattern: /\bvercel_[A-Za-z0-9]{20,}\b/g },
  { name: "Meta/WhatsApp access token", pattern: /\bEAA[A-Za-z0-9]{20,}\b/g },
  { name: "Meta OAuth code dump", pattern: /["'](?:code|access_token|user_access_token)["']\s*:\s*["'](?:EAA)?[A-Za-z0-9._-]{24,}["']/gi },
  { name: "Embedded Signup raw response", pattern: /(?:embedded[-_ ]signup|oauth)[-_ ]?(?:response|payload|dump)\s*[:=]\s*["'`]?\{/gi },
  { name: "Meta webhook raw payload", pattern: /["']object["']\s*:\s*["']whatsapp_business_account["'][\s\S]{0,160}["']entry["']\s*:/gi },
  { name: "Supabase secret key", pattern: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g },
  { name: "Supabase management token", pattern: /\bsbp_[A-Za-z0-9]{20,}\b/g },
  { name: "Authorization Bearer literal", pattern: /\bAuthorization\s*[:=]\s*["']?Bearer\s+[A-Za-z0-9._-]{20,}/gi },
  { name: "WhatsApp temporary media URL", pattern: /https:\/\/[^\s"']*(?:lookaside\.fbsbx\.com|fbcdn\.net)[^\s"']*[?&](?:token|sig|signature)=[A-Za-z0-9._%-]{20,}/gi },
  { name: "Private key block", pattern: new RegExp("BEGIN " + "PRIVATE KEY", "g") }
];

const forbiddenFilePatterns = [
  { name: "arquivo HAR", pattern: /\.har$/i },
  { name: "payload real de webhook WhatsApp", pattern: /(?:^|\/)whatsapp[-_].*(?:payload|webhook).*(?:\.json|\.txt|\.log)$/i },
  { name: "dump de mídia WhatsApp", pattern: /(?:^|\/)(?:whatsapp[-_])?media[-_](?:dump|export|backup)(?:\/|\.|$)/i },
  { name: "dump ou export real de templates Meta", pattern: /(?:^|\/)(?:meta|whatsapp)[-_].*template.*(?:payload|dump|export|backup).*(?:\.json|\.txt|\.log)$/i },
  { name: "dump real de templates WhatsApp", pattern: /(?:^|\/)template[-_](?:dump|export|backup)(?:\/|\.|$)/i },
  { name: "dump OAuth ou Embedded Signup", pattern: /(?:^|\/)(?:meta|whatsapp|embedded[-_]?signup|oauth)[-_].*(?:response|payload|dump|export|backup).*(?:\.json|\.txt|\.log)$/i }
];

const sensitiveEnvNames = [
  "KIWIFY_WEBHOOK_SECRET",
  "INTERNAL_JOB_SECRET",
  "META_APP_SECRET",
  "OPENAI_API_KEY",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_TOKEN_ENCRYPTION_KEY",
  "WHATSAPP_BUSINESS_ACCOUNT_ID",
  "WHATSAPP_VERIFY_TOKEN",
  "WHATSAPP_APP_SECRET",
  "SENTRY_AUTH_TOKEN",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "STRIPE_RESTRICTED_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "UPSTASH_REDIS_REST_TOKEN"
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

function trackedEnvFiles() {
  return execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => /^\.env(?:$|\.)/.test(normalizePath(file)) && normalizePath(file) !== ".env.example");
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

function main() {
  const findings = [];

  for (const file of trackedEnvFiles()) {
    findings.push({ file, lineNumber: 1, label: "arquivo de ambiente rastreado" });
  }

  for (const file of candidateFiles()) {
    const normalizedFile = normalizePath(file);
    for (const blocked of forbiddenFilePatterns) {
      if (blocked.pattern.test(normalizedFile)) findings.push({ file, lineNumber: 1, label: blocked.name });
    }
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
}

if (require.main === module) main();

module.exports = { forbiddenFilePatterns, isSafePlaceholder, scanEnvAssignment, sensitiveEnvNames, secretPatterns };
