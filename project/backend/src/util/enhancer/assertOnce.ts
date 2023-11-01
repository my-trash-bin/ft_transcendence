import { AssertionException } from '../exception/AssertionException';

export function assertOnce<TResult, TArgs extends any[]>(
  func?: (...args: TArgs) => TResult,
) {
  let executed = false;
  return (...args: TArgs) => {
    if (executed) throw new AssertionException('assertOnce: already executed');
    executed = true;
    func?.(...args);
  };
}
