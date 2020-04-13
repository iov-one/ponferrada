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
  readonly names?: readonly string[];
  readonly hasStoredPersona?: boolean;
}

export interface PersonaContextInterface {
  readonly mnemonic: string;
  readonly connectedChains: readonly ChainId[];
  readonly accounts: readonly PersonaAcccount[];
  readonly balances: readonly (readonly Amount[])[];
  readonly names: readonly string[];
  readonly hasStoredPersona: boolean;
  readonly update: (newData: PersonaContextUpdateData) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  mnemonic: "",
  connectedChains: [],
  accounts: [],
  balances: [],
  names: [],
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
  const [mnemonic, setMnemonic] = React.useState<string>("");
  const [connectedChains, setConnectedChains] = React.useState<readonly ChainId[]>(
    persona ? persona.connectedChains : [],
  );
  const [accounts, setAccounts] = React.useState<Accounts>([]);
  const [balances, setBalances] = React.useState<readonly (readonly Amount[])[]>([]);
  const [names, setNames] = React.useState<readonly string[]>([]);
  const [storedPersonaExists, setStoredPersonaExists] = React.useState<boolean>(hasStoredPersona);

  React.useEffect(() => {
    let isSubscribed = true;
    async function loadPersonaData(persona: GetPersonaResponse): Promise<void> {
      const personaData: PersonaContextUpdateData = {
        ...persona,
        accounts: await persona?.getAccounts(),
        balances: await persona?.getBalances(),
        names: await persona?.getNames(),
      };

      if (isSubscribed && personaData) {
        loadPersonaInReact(personaData);
      }
    }
    loadPersonaData(persona);

    return () => {
      isSubscribed = false;
    };
  }, [persona]);

  const loadPersonaInReact = (newData: PersonaContextUpdateData): void => {
    if (newData.mnemonic !== undefined) setMnemonic(newData.mnemonic);
    if (newData.connectedChains !== undefined) setConnectedChains(newData.connectedChains);
    if (newData.accounts !== undefined) setAccounts(newData.accounts);
    if (newData.balances !== undefined) setBalances(newData.balances);
    if (newData.names !== undefined) setNames(newData.names);
    if (newData.hasStoredPersona !== undefined) {
      setStoredPersonaExists(newData.hasStoredPersona);
      if (!newData.hasStoredPersona) {
        setMnemonic("");
        setConnectedChains([]);
        setAccounts([]);
        setBalances([]);
        setNames([]);
      }
    }
  };

  const personaContextValue = {
    mnemonic,
    connectedChains,
    accounts,
    balances,
    names,
    hasStoredPersona: storedPersonaExists,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
