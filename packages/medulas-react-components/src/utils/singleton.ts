/* eslint-disable @typescript-eslint/no-explicit-any */
export const singleton = <T extends (...args: any[]) => any>(
  fn: (...args: Parameters<T>) => ReturnType<T>
): ((...args: Parameters<T>) => ReturnType<T>) => {
  let executed = false;
  let response: ReturnType<T>;

  return (...args: Parameters<T>): ReturnType<T> => {
    if (executed) {
      return response;
    }

    executed = true;
    response = fn.apply(undefined, args);

    return response;
  };
};
