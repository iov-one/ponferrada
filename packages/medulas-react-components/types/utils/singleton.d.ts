export declare const singleton: <T extends (...args: any[]) => any>(
  fn: (...args: Parameters<T>) => ReturnType<T>,
) => (...args: Parameters<T>) => ReturnType<T>;
