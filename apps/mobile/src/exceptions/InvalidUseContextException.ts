import React from 'react';

export class InvalidUseContextException extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(ReactContext: React.Context<any>) {
    const message = `Invalid \`useContext\` call. Cannot call a React hook when this is component is not a descendent of ${
      ReactContext.displayName ?? 'this context'
    }`;
    super(message);
    this.message = message;
    this.name = 'InvalidUseContextException';
    Error.captureStackTrace(this, this.constructor);
  }
}
