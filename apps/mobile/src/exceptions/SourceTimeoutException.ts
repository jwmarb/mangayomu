import { MangaSource } from '@mangayomu/mangascraper';
import { getErrorMessage } from '@/utils/helpers';

type MangaSourceMethods = keyof {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof MangaSource as MangaSource[K] extends (...args: any[]) => any
    ? K
    : never]: null;
};

export class SourceTimeoutException extends Error {
  public constructor(
    source: MangaSource,
    methodThatTimedOut: MangaSourceMethods,
    error?: unknown,
  ) {
    const message = `The method "${methodThatTimedOut}" from ${
      source.NAME
    } failed to send a response and has timed out.${
      error
        ? `\nThe following error was reported:\n\t${getErrorMessage(error)}`
        : ''
    }`;
    super(message);
    this.message = message;
    this.name = 'SourceTimeoutException';

    Error.captureStackTrace(this, this.constructor);
  }
}
