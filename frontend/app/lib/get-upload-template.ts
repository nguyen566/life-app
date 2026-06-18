// This helper allows the user to download the upload template XLSX file
// located in `public/upload_template.xlsx`.
// It creates a temporary <a> element, sets its href to the public path,
// and programmatically clicks it to trigger the browser download.

export const getUploadTemplate = (): void => {
  // Browser URL for static assets served from / (the Next.js public folder)
  const fileUrl = '/upload_template.xlsx';
  const fileName = 'upload_template.xlsx';

  const anchor = document.createElement('a');
  anchor.href = fileUrl;
  anchor.download = fileName;
  // For security, force downloading even if the browser would navigate
  anchor.dataset.downloadurl = `application/xlsx:${fileName}:${fileUrl}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
