import { describe, expect, it, vi } from "vitest";
import { copyResponseText } from "./clipboard";

describe("copyResponseText", () => {
  it("copia resposta para a area de transferencia", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText
      }
    });

    await copyResponseText("Resposta pronta");

    expect(writeText).toHaveBeenCalledWith("Resposta pronta");
    vi.unstubAllGlobals();
  });

  it("retorna erro amigavel quando clipboard nao existe", async () => {
    vi.stubGlobal("navigator", {});

    await expect(copyResponseText("Resposta pronta")).rejects.toThrow("Clipboard indisponivel");
    vi.unstubAllGlobals();
  });
});
