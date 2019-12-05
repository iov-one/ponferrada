import { Amount } from "@iov/bcp";
import * as React from "react";

import { GetPersonaResponse } from "../extension/background/model/backgroundscript";
import { PersonaAcccount } from "../extension/background/model/persona";

/** Only the fields that are set will be updated */
export interface PersonaContextUpdateData {
  readonly accounts?: readonly PersonaAcccount[];
  readonly mnemonic?: string;
  readonly balances?: readonly (readonly Amount[])[];
  readonly hasStoredPersona?: boolean;
}

export interface PersonaContextInterface {
  readonly accounts: readonly PersonaAcccount[];
  readonly balances: readonly (readonly Amount[])[];
  readonly mnemonic: string;
  readonly hasStoredPersona: boolean;
  readonly update: (newData: PersonaContextUpdateData) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  accounts: [],
  mnemonic: "",
  balances: [],
  hasStoredPersona: false,
  update: (): void => {},
});

interface Props {
  readonly children: React.ReactNode;
  readonly persona: GetPersonaResponse;
  readonly hasStoredPersona: boolean;
}

type Accounts = readonly PersonaAcccount[];

export const PersonaProvider = ({ children, persona, hasStoredPersona }: Props): JSX.Element => {
  const [accounts, setAccounts] = React.useState<Accounts>(persona ? persona.accounts : []);
  const [mnemonic, setMnemonic] = React.useState<string>(persona ? persona.mnemonic : "");
  const [storedPersonaExists, setStoredPersonaExists] = React.useState<boolean>(hasStoredPersona);
  const [balances, setBalances] = React.useState<readonly (readonly Amount[])[]>(
    persona ? persona.balances : [],
  );

  const loadPersonaInReact = (newData: PersonaContextUpdateData): void => {
    if (newData.accounts !== undefined) setAccounts(newData.accounts);
    if (newData.mnemonic !== undefined) setMnemonic(newData.mnemonic);
    if (newData.balances !== undefined) setBalances(newData.balances);
    if (newData.hasStoredPersona !== undefined) {
      setStoredPersonaExists(newData.hasStoredPersona);
      if (!newData.hasStoredPersona) {
        setAccounts([]);
        setMnemonic("");
        setBalances([]);
      }
    }
  };

  const personaContextValue = {
    accounts,
    mnemonic,
    balances,
    hasStoredPersona: storedPersonaExists,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
