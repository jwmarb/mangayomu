export function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && err != null) {
    if ('message' in err && typeof err.message === 'string') return err.message;
    if ('msg' in err && typeof err.msg === 'string') return err.msg;
    if ('stack' in err && typeof err.stack === 'string') return err.stack;
  }
  return 'No error code/message has been provided';
}
