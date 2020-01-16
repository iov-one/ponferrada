import { Amount, ChainId } from "@iov/bcp";
import * as React from "react";

import { GetPersonaResponse } from "../extension/background/model/backgroundscript";
import { PersonaAcccount } from "../extension/background/model/persona";

/** Only the fields that are set will be updated */
export interface PersonaContextUpdateData {
  readonly mnemonic?: string;
  readonly connectedChains?: readonly ChainId[];
  readonly accounts?: readonly PersonaAcccount[];
  readonly balances?: readonly (readonly Amount[])[];
  readonly starnames?: readonly string[];
  readonly hasStoredPersona?: boolean;
}

export interface PersonaContextInterface {
  readonly mnemonic: string;
  readonly connectedChains: readonly ChainId[];
  readonly accounts: readonly PersonaAcccount[];
  readonly balances: readonly (readonly Amount[])[];
  readonly starnames: readonly string[];
  readonly hasStoredPersona: boolean;
  readonly update: (newData: PersonaContextUpdateData) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  mnemonic: "",
  connectedChains: [],
  accounts: [],
  balances: [],
  starnames: [],
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
  const [mnemonic, setMnemonic] = React.useState<string>(persona ? persona.mnemonic : "");
  const [connectedChains, setConnectedChains] = React.useState<readonly ChainId[]>(
    persona ? persona.connectedChains : [],
  );
  const [accounts, setAccounts] = React.useState<Accounts>(persona ? persona.accounts : []);
  const [balances, setBalances] = React.useState<readonly (readonly Amount[])[]>(
    persona ? persona.balances : [],
  );
  const [starnames, setStarnames] = React.useState<readonly string[]>(persona ? persona.starnames : []);
  const [storedPersonaExists, setStoredPersonaExists] = React.useState<boolean>(hasStoredPersona);

  const loadPersonaInReact = (newData: PersonaContextUpdateData): void => {
    if (newData.mnemonic !== undefined) setMnemonic(newData.mnemonic);
    if (newData.connectedChains !== undefined) setConnectedChains(newData.connectedChains);
    if (newData.accounts !== undefined) setAccounts(newData.accounts);
    if (newData.balances !== undefined) setBalances(newData.balances);
    if (newData.starnames !== undefined) setStarnames(newData.starnames);
    if (newData.hasStoredPersona !== undefined) {
      setStoredPersonaExists(newData.hasStoredPersona);
      if (!newData.hasStoredPersona) {
        setMnemonic("");
        setConnectedChains([]);
        setAccounts([]);
        setBalances([]);
        setStarnames([]);
      }
    }
  };

  const personaContextValue = {
    mnemonic,
    connectedChains,
    accounts,
    balances,
    starnames,
    hasStoredPersona: storedPersonaExists,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
