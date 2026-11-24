export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  let link: HTMLAnchorElement | null = null;

  try {
    link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  } finally {
    link?.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
