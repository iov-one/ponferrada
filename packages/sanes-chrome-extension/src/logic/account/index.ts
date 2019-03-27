import { CodecType } from '../blockchain/connection';

class Account {
  private _derivation: number;
  private _bcAddresses: Map<CodecType, string> = new Map([]); // [["eth","0xajkfgshdjlg"]

  public constructor(derivation: number) {
    this._derivation = derivation;
  }

  public addBlockchainAddress(codecType: CodecType, bcAddress: string): void {
    this._bcAddresses.set(codecType, bcAddress);
  }

  public get derivation(): number {
    return this._derivation;
  }
}

export default Account;
