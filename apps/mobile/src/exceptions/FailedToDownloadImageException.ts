export class FailedToDownloadImageException extends Error {
  constructor(url: string, path: string, statusCode: number) {
    super(
      `Failed to download "${url}" as "${path}". The response sent a status code ${statusCode}`,
    );
    Error.captureStackTrace(this, this.constructor);
  }
}
