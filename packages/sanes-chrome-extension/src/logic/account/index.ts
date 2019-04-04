export class Account {
  private _derivation: number;

  public constructor(derivation: number) {
    this._derivation = derivation;
  }

  public get derivation(): number {
    return this._derivation;
  }
}
