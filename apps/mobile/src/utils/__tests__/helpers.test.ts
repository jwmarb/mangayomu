import { getErrorMessage } from '@/utils/helpers';

describe('getErrorMessage', () => {
  it('extracts error correctly', () => {
    expect(getErrorMessage(new Error('a'))).toEqual('a');
    expect(getErrorMessage({ message: 'a' })).toEqual('a');
    expect(getErrorMessage({ stack: 'a' })).toEqual('a');
    expect(getErrorMessage({ msg: 'a' })).toEqual('a');
    expect(getErrorMessage('a')).toEqual('a');
    expect(getErrorMessage({})).toEqual(
      'No error code/message has been provided',
    );
    expect(getErrorMessage(null)).toEqual(
      'No error code/message has been provided',
    );
    expect(getErrorMessage(undefined)).toEqual(
      'No error code/message has been provided',
    );
  });
});
