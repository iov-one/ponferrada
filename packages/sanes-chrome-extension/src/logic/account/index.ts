import { CodecType } from '../../utils/config';

class Account {
  private _derivation: number;
  private _bcAddresses: Map<CodecType, string> = new Map([]); // [["eth","0xajkfgshdjlg"]

  public constructor(derivation: number) {
    this._derivation = derivation;
  }

  public addBlockchainAddress(codecType: string, bcAddress: string): void {
    this._bcAddresses.set(codecType, bcAddress);
  }

  public get derivation(): number {
    return this._derivation;
  }
}

export default Account;
