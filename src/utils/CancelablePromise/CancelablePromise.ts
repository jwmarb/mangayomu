export default class CancelablePromise<T> extends Promise<T> {
  private _isCanceled: boolean;
  public constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
    super(executor);
    this._isCanceled = false;
  }
  public async then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    if (!this.isCanceled()) return super.then(onfulfilled, onrejected);
    return Promise.reject('Promise canceled');
  }

  public isCanceled() {
    return this._isCanceled;
  }

  public cancel() {
    this._isCanceled = true;
  }
}
