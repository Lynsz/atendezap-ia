export async function copyResponseText(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Clipboard indisponivel");
  }

  await navigator.clipboard.writeText(value);
}
