import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const srcRoot = join(repoRoot, "src");

function readSource(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return collectSourceFiles(fullPath);
    }

    if (/\.(ts|tsx)$/.test(entry)) {
      return [fullPath];
    }

    return [];
  });
}

describe("fronteira Supabase server/client", () => {
  it("mantem o cliente service role restrito ao servidor", () => {
    const source = readSource("src/lib/supabase/server.ts");

    expect(source).toContain('import "server-only";');
    expect(source).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(source).toContain("persistSession: false");
  });

  it("mantem o browser client sem service role", () => {
    const source = readSource("src/lib/supabase/browser.ts");

    expect(source).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    expect(source).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(source).not.toContain("getSupabaseAdmin");
  });

  it("nao importa service role em componentes client", () => {
    const clientFiles = collectSourceFiles(srcRoot)
      .map((filePath) => ({
        filePath,
        source: readFileSync(filePath, "utf8")
      }))
      .filter(({ source }) => /^\s*["']use client["'];/m.test(source));

    for (const { filePath, source } of clientFiles) {
      const label = relative(repoRoot, filePath);

      expect(source, label).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
      expect(source, label).not.toContain("getSupabaseAdmin");
      expect(source, label).not.toContain("@/lib/supabase/server");
      expect(source, label).not.toContain("../lib/supabase/server");
    }
  });
});
