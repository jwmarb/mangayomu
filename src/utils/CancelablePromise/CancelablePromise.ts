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

  public start() {
    return this.promise;
  }

  public isCanceled() {
    return this._isCanceled;
  }

  public cancel() {
    this._isCanceled = true;
  }
}
