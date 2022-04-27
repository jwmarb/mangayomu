export function convertToURI(title: string, mangaCoverURI: string): Promise<string> {
  return new Promise((res, rej) => {
    const matched = mangaCoverURI.match(/\.(jpg|png|jpeg|gif)/g);
    if (matched == null) return rej('Invalid file extension');
    const [fileExtension] = matched;
    res('MangaYomu+' + encodeURIComponent(title) + fileExtension);
  });
}
