import { saveAs } from "file-saver";

/** Trigger a file download that works on mobile Safari + desktop. Throws on failure. */
export async function triggerBlobDownload(blob: Blob, filename: string): Promise<void> {
  if (!blob || blob.size <= 0) {
    throw new Error("Export produced an empty file");
  }

  // file-saver handles most browsers; fall back to anchor download if needed
  try {
    saveAs(blob, filename);
  } catch {
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      // Delay revoke so Safari can start the download
      setTimeout(() => URL.revokeObjectURL(url), 2500);
    }
  }

  // Give the browser a tick to start the download pipeline
  await new Promise((r) => setTimeout(r, 50));
}

export function invoiceFilename(invoiceNumber: string, ext: "pdf" | "docx"): string {
  const base = (invoiceNumber || "invoice").replace(/[^a-zA-Z0-9-_]/g, "_");
  return base + "." + ext;
}
