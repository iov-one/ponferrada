import { PublicIdentity } from '@iov/bcp';

export class BlockchainAccount {
  private _derivation: number;
  private _address: string;
  private _publicIdentity: PublicIdentity;

  public constructor(
    derivation: number,
    address: string,
    publicIdentity: PublicIdentity
  ) {
    this._derivation = derivation;
    this._address = address;
    this._publicIdentity = publicIdentity;
  }

  public get derivation(): number {
    return this._derivation;
  }

  public get address(): string {
    return this._address;
  }

  public get publicIdentity(): PublicIdentity {
    return this._publicIdentity;
  }
}

class Account {
  private _bnsIdentity: PublicIdentity | undefined;
  private _bovIdentity: PublicIdentity | undefined;
  private _lskIdentity: PublicIdentity | undefined;
  private _ethIdentity: PublicIdentity | undefined;

  public get bnsIdentity(): PublicIdentity | undefined {
    return this._bnsIdentity;
  }

  public set bnsIdentity(bnsIdentity) {
    this._bnsIdentity = bnsIdentity;
  }

  public get bovIdentity(): PublicIdentity | undefined {
    return this._bovIdentity;
  }

  public set bovIdentity(bovIdentity) {
    this._bovIdentity = bovIdentity;
  }

  public get lskIdentity(): PublicIdentity | undefined {
    return this._lskIdentity;
  }

  public set lskIdentity(lskIdentity) {
    this._lskIdentity = lskIdentity;
  }

  public get ethIdentity(): PublicIdentity | undefined {
    return this._ethIdentity;
  }

  public set ethIdentity(ethIdentity) {
    this._ethIdentity = ethIdentity;
  }
}

export default Account;
