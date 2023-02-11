export function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && err != null) {
    if ('message' in err) return err.message as string;
    if ('msg' in err) return err.msg as string;
    if ('stack' in err) return err.stack as string;
  }
  return 'No error code/message has been provided';
}
