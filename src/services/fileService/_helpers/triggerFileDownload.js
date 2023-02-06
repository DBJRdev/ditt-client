/**
 * Forces the browser to download the resource identified by the given URI
 *
 * @param filename The name of the downloaded file
 * @param uri The URI to download
 */
export const triggerFileDownload = (filename, uri) => {
  const element = document.createElement('a');
  element.setAttribute('href', uri);
  element.setAttribute('download', filename);

  // Element must be appended to document to be working in FF
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
