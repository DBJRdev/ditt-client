import { triggerFileDownload } from './_helpers/triggerFileDownload';

export const downloadTextFile = (filename, mimeType, content) => {
  triggerFileDownload(
    filename,
    `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`,
  );
};
