/**
 * A Promise wrapper that converts a regular Promise into a cancellable one. This should only be used for components performing asynchronous tasks (such as API requests) so that when the promise is fulfilled, the component should not rerender when it is unmounted
 */
export default class CancelablePromise<T> {
  private _isCanceled: boolean;
  private promise: Promise<T>;

  public constructor(executor: () => Promise<T>) {
    this.promise = new Promise((res, rej) => {
      executor()
        .then((val) => (this.isCanceled() ? rej('Promise canceled') : res(val)))
        .catch(rej);
    });
    this._isCanceled = false;
  }

  /**
   * Create/start a promise to perform an asynchronous operation
   * @returns Returns the promise
   */
  public start() {
    return this.promise;
  }

  public isCanceled() {
    return this._isCanceled;
  }

  /**
   * Cancels the promise
   */
  public cancel() {
    this._isCanceled = true;
  }
}
