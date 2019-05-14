/*global chrome*/
import * as React from 'react';
import { AccountInfo } from '../logic/persona/accountManager';
import { ProcessedTx } from '../logic/persona';
import { isMessageToForeground, MessageToForegroundAction, GetPersonaResponse } from '../extension/messages';

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
  readonly persona: GetPersonaResponse;
}

export const PersonaProvider = ({ children, persona }: Props): JSX.Element => {
  const [accountNames, setAccountNames] = React.useState<Accounts>(persona ? persona.accounts : []);
  const [mnemonic, setMnemonic] = React.useState<string>(persona ? persona.mnemonic : '');
  const [txs, setTxs] = React.useState<ReadonlyArray<ProcessedTx>>(persona ? persona.txs : []);
  React.useEffect(() => {
    const isExtensionContext = typeof chrome !== 'undefined';
    if (!isExtensionContext) {
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

  const loadPersonaInReact = (
    accountNames: Accounts,
    mnemonic: string,
    txs: ReadonlyArray<ProcessedTx>,
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
