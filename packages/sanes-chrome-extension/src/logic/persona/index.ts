import Account from '../account';

class Persona {
  // K is the account id: main, savings...
  private _accounts: Map<string, Account> = new Map([]);

  public addAccount(id: string, account: Account): void {
    this._accounts.set(id, account);
  }

  public get accounts(): Map<string, Account> {
    return this._accounts;
  }
}

export default Persona;
