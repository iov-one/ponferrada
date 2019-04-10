import { Amount } from '@iov/bcp';
import * as React from 'react';

type Accounts = ReadonlyArray<string>;
type Balances = Map<string, ReadonlyArray<Amount>>;

export interface PersonaContextInterface {
  readonly accountNames: Accounts;
  readonly balances: Balances;
  readonly update: (
    accountNames: Accounts,
    balances: Map<string, ReadonlyArray<Amount>>
  ) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  accountNames: [],
  balances: new Map(),
  update: (): void => {},
});

interface Props {
  readonly children: React.ReactNode;
}

export const ToastProvider = ({ children }: Props): JSX.Element => {
  const [accountNames, setAccountNames] = React.useState<Accounts>([]);
  const [balances, setBalances] = React.useState<Balances>(new Map());
  const loadPersona = (
    accountNames: Accounts,
    balances: Map<string, ReadonlyArray<Amount>>
  ): void => {
    setAccountNames(accountNames);
    setBalances(balances);
  };

  const personaContextValue = {
    accountNames,
    balances,
    update: loadPersona,
  };

  return (
    <PersonaContext.Provider value={personaContextValue}>
      {children}
    </PersonaContext.Provider>
  );
};
