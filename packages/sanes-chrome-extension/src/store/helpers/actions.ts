import {
  Fn,
  Fn0,
  Fn1,
  Fn2,
  Fn3,
  Fn4,
  isFn0,
  isFn1,
  isFn2,
  isFn3,
} from './functions';

// this is how we trigger the action
export interface ActionPayload<T, P> {
  readonly type: T;
  readonly payload: P;
}

// one-heavily overloaded function
export function createSyncAction<T extends string, R>(
  t: T,
  fn: Fn0<R>
): Fn0<ActionPayload<T, R>>;
export function createSyncAction<T extends string, A1, R>(
  t: T,
  fn: Fn1<R, A1>
): Fn1<ActionPayload<T, R>, A1>;
export function createSyncAction<T extends string, A1, A2, R>(
  t: T,
  fn: Fn2<R, A1, A2>
): Fn2<ActionPayload<T, R>, A1, A2>;
export function createSyncAction<T extends string, A1, A2, A3, R>(
  t: T,
  fn: Fn3<R, A1, A2, A3>
): Fn3<ActionPayload<T, R>, A1, A2, A3>;
export function createSyncAction<T extends string, A1, A2, A3, A4, R>(
  t: T,
  fn: Fn4<R, A1, A2, A3, A4>
): Fn4<ActionPayload<T, R>, A1, A2, A3, A4>;
export function createSyncAction<T extends string, R, A1, A2, A3, A4>(
  t: T,
  fn: Fn<R, A1, A2, A3, A4>
): Fn<ActionPayload<T, R>, A1, A2, A3, A4> {
  if (isFn0(fn)) {
    return () => ({ type: t, payload: fn() });
  } else if (isFn1(fn)) {
    return (a: A1) => ({ type: t, payload: fn(a) });
  } else if (isFn2(fn)) {
    return (a: A1, b: A2) => ({ type: t, payload: fn(a, b) });
  } else if (isFn3(fn)) {
    return (a: A1, b: A2, c: A3) => ({ type: t, payload: fn(a, b, c) });
  } else {
    return (a: A1, b: A2, c: A3, d: A4) => ({
      type: t,
      payload: fn(a, b, c, d),
    });
  }
}

// tslint:disable-next-line:no-empty
function voidFunc(): void {}

export type PromiseFn<P, A1, A2, A3, A4> = Fn<Promise<P>, A1, A2, A3, A4>;
export const createPromiseAction = <
  T0 extends string,
  T1 extends string,
  T2 extends string,
  T3 extends string
>(
  send: T0,
  pend: T1,
  suc: T2,
  err: T3
) => <P, A1, A2, A3, A4>(fn: PromiseFn<P, A1, A2, A3, A4>) => ({
  start: createSyncAction(send, fn),
  request: createSyncAction(pend, voidFunc),
  success: createSyncAction(suc, (p: P) => p),
  failure: createSyncAction(err, (e: Error) => e),
});
