export declare type SingletonInitializerFunction = (...args: any[]) => any;
export declare function singleton<T extends SingletonInitializerFunction>(
  fn: (...args: Parameters<T>) => ReturnType<T>,
): (...args: Parameters<T>) => ReturnType<T>;
