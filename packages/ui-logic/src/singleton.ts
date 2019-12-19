export type SingletonInitializerFunction = (...args: any[]) => any;

export function singleton<T extends SingletonInitializerFunction>(
  fn: (...args: Parameters<T>) => ReturnType<T>,
): (...args: Parameters<T>) => ReturnType<T> {
  let executed = false;
  let response: ReturnType<T>;

  return (...args: Parameters<T>): ReturnType<T> => {
    if (executed) {
      return response;
    }

    executed = true;
    response = fn(...args);

    return response;
  };
}
