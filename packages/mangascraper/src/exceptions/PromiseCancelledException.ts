export class PromiseCancelledException extends Error {
  /**
   * The name of the error
   */
  public readonly name: string;

  /**
   * The message this error emits
   */
  public readonly message: string;
  public constructor() {
    super();
    this.name = 'PROMISE_CANCELED';
    this.message = 'Cancelled promise operation';
  }
}
