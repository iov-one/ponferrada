import * as React from 'react';
import { AccountInfo } from '../logic/persona/accountManager';

type Accounts = ReadonlyArray<AccountInfo>;

export interface PersonaContextInterface {
  readonly accountNames: Accounts;
  readonly mnemonic: string;
  readonly update: (accountNames: Accounts, mnemonic: string) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  accountNames: [],
  mnemonic: '',
  update: (): void => {},
});

interface Props {
  readonly children: React.ReactNode;
}

export const PersonaProvider = ({ children }: Props): JSX.Element => {
  const [accountNames, setAccountNames] = React.useState<Accounts>([]);
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const loadPersonaInReact = (accountNames: Accounts, mnemonic: string): void => {
    setAccountNames(accountNames);
    setMnemonic(mnemonic);
  };

  const personaContextValue = {
    accountNames,
    mnemonic,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
