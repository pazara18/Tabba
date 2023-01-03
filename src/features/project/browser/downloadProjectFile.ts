export function downloadTextFile(
  fileName: string,
  contents: string,
  mimeType = "application/json"
) {
  const blob = new Blob([contents], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

