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

    chrome.runtime.onMessage.addListener((msg, sender, _sendResponse) => {
      const sameTarget = sender.id === chrome.runtime.id;
      const msgToForeground = isMessageToForeground(msg);
      const msgToPersonaProvider = msg.action === MessageToForegroundAction.TransactionsChanged;
      if (!sameTarget || !msgToForeground || !msgToPersonaProvider) {
        // Only handle messages from background script
        return;
      }

      switch (msg.action) {
        case MessageToForegroundAction.TransactionsChanged:
          if (!Array.isArray(msg.data)) {
            throw new Error('Data must be an array');
          }
          setTxs(msg.data);
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
