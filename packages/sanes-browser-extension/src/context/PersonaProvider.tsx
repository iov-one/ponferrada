import { Amount } from "@iov/bcp";
import * as React from "react";

import { GetPersonaResponse } from "../extension/background/model/backgroundscript";
import { PersonaAcccount, ProcessedTx } from "../extension/background/model/persona";
import {
  isMessageToForeground,
  MessageToForegroundAction,
} from "../extension/background/updaters/appUpdater";
import { extensionContext, getPersonaData } from "../utils/chrome";

/** Only the fields that are set will be updated */
export interface PersonaContextUpdateData {
  readonly accounts?: readonly PersonaAcccount[];
  readonly mnemonic?: string;
  readonly txs?: readonly ProcessedTx[];
  readonly balances?: readonly (readonly Amount[])[];
  readonly hasStoredPersona?: boolean;
}

export interface PersonaContextInterface {
  readonly accounts: readonly PersonaAcccount[];
  readonly txs: readonly ProcessedTx[];
  readonly balances: readonly (readonly Amount[])[];
  readonly mnemonic: string;
  readonly hasStoredPersona: boolean;
  readonly update: (newData: PersonaContextUpdateData) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  accounts: [],
  mnemonic: "",
  txs: [],
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
  const [txs, setTxs] = React.useState<readonly ProcessedTx[]>(persona ? persona.txs : []);
  const [balances, setBalances] = React.useState<readonly (readonly Amount[])[]>(
    persona ? persona.balances : [],
  );
  React.useEffect(() => {
    if (!extensionContext()) {
      return;
    }

    chrome.runtime.onMessage.addListener((msg, sender, _sendResponse) => {
      const sameTarget = sender.id === chrome.runtime.id;
      if (!sameTarget || !isMessageToForeground(msg)) {
        // Only handle messages from background script
        return;
      }

      switch (msg.action) {
        case MessageToForegroundAction.TransactionsChanged:
          getPersonaData()
            .then(personaData => {
              if (personaData) {
                setTxs(personaData.txs);
                setBalances(personaData.balances);
              } else {
                console.warn("Could not get persona data after receiving TransactionsChanged message");
              }
            })
            .catch(error => {
              console.error(error);
            });
          break;
        default:
        // this listener is not responsible for the given message, ignore message
      }
    });
  }, []);

  const loadPersonaInReact = (newData: PersonaContextUpdateData): void => {
    if (newData.accounts !== undefined) setAccounts(newData.accounts);
    if (newData.mnemonic !== undefined) setMnemonic(newData.mnemonic);
    if (newData.txs !== undefined) setTxs(newData.txs);
    if (newData.balances !== undefined) setBalances(newData.balances);
    if (newData.hasStoredPersona !== undefined) {
      setStoredPersonaExists(newData.hasStoredPersona);
      if (!newData.hasStoredPersona) {
        setAccounts([]);
        setMnemonic("");
        setTxs([]);
        setBalances([]);
      }
    }
  };

  const personaContextValue = {
    accounts,
    mnemonic,
    txs,
    balances,
    hasStoredPersona: storedPersonaExists,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
