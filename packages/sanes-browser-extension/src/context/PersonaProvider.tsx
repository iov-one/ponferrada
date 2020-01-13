import { Amount } from "@iov/bcp";
import * as React from "react";

import { GetPersonaResponse } from "../extension/background/model/backgroundscript";
import { ChainStatus, PersonaAcccount } from "../extension/background/model/persona";

/** Only the fields that are set will be updated */
export interface PersonaContextUpdateData {
  readonly mnemonic?: string;
  readonly chainStatuses?: readonly ChainStatus[];
  readonly accounts?: readonly PersonaAcccount[];
  readonly balances?: readonly (readonly Amount[])[];
  readonly starnames?: readonly string[];
  readonly hasStoredPersona?: boolean;
}

export interface PersonaContextInterface {
  readonly mnemonic: string;
  readonly chainStatuses: readonly ChainStatus[];
  readonly accounts: readonly PersonaAcccount[];
  readonly balances: readonly (readonly Amount[])[];
  readonly starnames: readonly string[];
  readonly hasStoredPersona: boolean;
  readonly update: (newData: PersonaContextUpdateData) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  mnemonic: "",
  chainStatuses: [],
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
  const [chainStatuses, setChainStatuses] = React.useState<readonly ChainStatus[]>(
    persona ? persona.chainStatuses : [],
  );
  const [accounts, setAccounts] = React.useState<Accounts>(persona ? persona.accounts : []);
  const [balances, setBalances] = React.useState<readonly (readonly Amount[])[]>(
    persona ? persona.balances : [],
  );
  const [starnames, setStarnames] = React.useState<readonly string[]>(persona ? persona.starnames : []);
  const [storedPersonaExists, setStoredPersonaExists] = React.useState<boolean>(hasStoredPersona);

  const loadPersonaInReact = (newData: PersonaContextUpdateData): void => {
    if (newData.mnemonic !== undefined) setMnemonic(newData.mnemonic);
    if (newData.chainStatuses !== undefined) setChainStatuses(newData.chainStatuses);
    if (newData.accounts !== undefined) setAccounts(newData.accounts);
    if (newData.balances !== undefined) setBalances(newData.balances);
    if (newData.starnames !== undefined) setStarnames(newData.starnames);
    if (newData.hasStoredPersona !== undefined) {
      setStoredPersonaExists(newData.hasStoredPersona);
      if (!newData.hasStoredPersona) {
        setMnemonic("");
        setChainStatuses([]);
        setAccounts([]);
        setBalances([]);
        setStarnames([]);
      }
    }
  };

  const personaContextValue = {
    mnemonic,
    chainStatuses,
    accounts,
    balances,
    starnames,
    hasStoredPersona: storedPersonaExists,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
