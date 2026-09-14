export function estimateFilename(docNumber: string, ext: "pdf" | "docx"): string {
  const base = (docNumber || "estimate").replace(/[^a-zA-Z0-9-_]/g, "_");
  return base + "." + ext;
}
