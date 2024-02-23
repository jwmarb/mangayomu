export class InvalidSourceException extends Error {
  /**
   * The name of the error
   */
  public readonly name: string;

  /**
   * The message this error emits
   */
  public readonly message: string;
  public constructor(attemptedSourceName: string) {
    super();
    this.name = 'INVALID_SOURCE_ERROR';
    this.message = `Tried to get a source named "${attemptedSourceName}" from MangaHost.getSource(), but the source does not exist.`;
  }
}
