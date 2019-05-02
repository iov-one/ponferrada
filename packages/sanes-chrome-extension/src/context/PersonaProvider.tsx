import * as React from 'react';
import { AccountInfo } from '../logic/persona/accountManager';
import { ProcessedTx } from '../routes/account/components/ListTxs';

type Accounts = ReadonlyArray<AccountInfo>;

export interface PersonaContextInterface {
  readonly accountNames: Accounts;
  readonly txs: ReadonlyArray<ProcessedTx>;
  readonly mnemonic: string;
  readonly update: (accountNames: Accounts, mnemonic: string, txs: ReadonlyArray<ProcessedTx>) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  accountNames: [],
  mnemonic: '',
  txs: [],
  update: (): void => {},
});

interface Props {
  readonly children: React.ReactNode;
}

export const PersonaProvider = ({ children }: Props): JSX.Element => {
  const [accountNames, setAccountNames] = React.useState<Accounts>([]);
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const [txs, setTxs] = React.useState<ReadonlyArray<ProcessedTx>>([]);

  const loadPersonaInReact = (
    accountNames: Accounts,
    mnemonic: string,
    txs: ReadonlyArray<ProcessedTx>
  ): void => {
    setAccountNames(accountNames);
    setMnemonic(mnemonic);
    setTxs(txs);
  };

  const personaContextValue = {
    accountNames,
    mnemonic,
    txs,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
