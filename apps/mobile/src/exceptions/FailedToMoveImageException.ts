import { getErrorMessage } from '@/utils/helpers';

export class FailedToMoveImageException extends Error {
  constructor(path: string, dest: string, e: unknown) {
    super(
      `Failed to move "${path}" to "${dest}". Received error:\n${getErrorMessage(
        e,
      )}`,
    );

    Error.captureStackTrace(this, this.constructor);
  }
}
