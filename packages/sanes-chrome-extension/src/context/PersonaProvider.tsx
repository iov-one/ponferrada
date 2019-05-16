/*global chrome*/
import * as React from 'react';
import {
  GetPersonaResponse,
  isMessageToForeground,
  MessageToForegroundAction,
} from '../extension/background/messages';
import { PersonaAcccount, ProcessedTx } from '../logic/persona';
import { extensionContext } from '../utils/chrome';

/** Only the fields that are set will be updated */
export interface PersonaContextUpdateData {
  readonly accounts?: ReadonlyArray<PersonaAcccount>;
  readonly mnemonic?: string;
  readonly txs?: ReadonlyArray<ProcessedTx>;
}

export interface PersonaContextInterface {
  readonly accounts: ReadonlyArray<PersonaAcccount>;
  readonly txs: ReadonlyArray<ProcessedTx>;
  readonly mnemonic: string;
  readonly update: (newData: PersonaContextUpdateData) => void;
}

export const PersonaContext = React.createContext<PersonaContextInterface>({
  accounts: [],
  mnemonic: '',
  txs: [],
  update: (): void => {},
});

interface Props {
  readonly children: React.ReactNode;
  readonly persona: GetPersonaResponse;
}

type Accounts = ReadonlyArray<PersonaAcccount>;

export const PersonaProvider = ({ children, persona }: Props): JSX.Element => {
  const [accounts, setAccounts] = React.useState<Accounts>(persona ? persona.accounts : []);
  const [mnemonic, setMnemonic] = React.useState<string>(persona ? persona.mnemonic : '');
  const [txs, setTxs] = React.useState<ReadonlyArray<ProcessedTx>>(persona ? persona.txs : []);
  React.useEffect(() => {
    if (!extensionContext()) {
      return;
    }

    console.log('PersonaProvider registering listener');
    chrome.runtime.onMessage.addListener((message, sender, _sendResponse) => {
      if (sender.id !== chrome.runtime.id || !isMessageToForeground(message)) {
        // Only handle messages from background script
        return;
      }

      switch (message.action) {
        case MessageToForegroundAction.TransactionsChanges:
          if (!Array.isArray(message.data)) {
            throw new Error('Data must be an array');
          }
          setTxs(message.data);
          break;
        default:
          throw new Error('Unknown action');
      }
    });
  }, []);

  const loadPersonaInReact = (newData: PersonaContextUpdateData): void => {
    if (newData.accounts !== undefined) setAccounts(newData.accounts);
    if (newData.mnemonic !== undefined) setMnemonic(newData.mnemonic);
    if (newData.txs !== undefined) setTxs(newData.txs);
  };

  const personaContextValue = {
    accounts,
    mnemonic,
    txs,
    update: loadPersonaInReact,
  };

  return <PersonaContext.Provider value={personaContextValue}>{children}</PersonaContext.Provider>;
};
