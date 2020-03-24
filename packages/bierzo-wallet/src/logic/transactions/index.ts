import { Address, ChainId, Identity, UnsignedTransaction } from "@iov/bcp";
import {
  isDeleteAccountTx,
  isDeleteDomainTx,
  isRegisterAccountTx,
  isRegisterDomainTx,
  isRegisterUsernameTx,
  isReplaceAccountTargetsTx,
  isTransferAccountTx,
  isTransferDomainTx,
  isTransferUsernameTx,
  isUpdateTargetsOfUsernameTx,
} from "@iov/bns";
import { ReadonlyDate } from "readonly-date";
import { Dispatch } from "redux";
import { Subscription } from "xstream";

import { getConfig } from "../../config";
import { addAccountsAction, BwAccount, removeAccountAction } from "../../store/accounts";
import { addTransaction } from "../../store/notifications";
import { addUsernamesAction, BwUsername, removeUsernameAction } from "../../store/usernames";
import { getCodec } from "../codec";
import { getConnectionForBns, getConnectionForChainId } from "../connection";
import { BwParserFactory } from "./types/BwParserFactory";

function mayDispatchUsername(dispatch: Dispatch, usernameTx: UnsignedTransaction): void {
  if (isRegisterUsernameTx(usernameTx) || isUpdateTargetsOfUsernameTx(usernameTx)) {
    const username: BwUsername = {
      username: usernameTx.username,
      addresses: usernameTx.targets,
    };

    dispatch(addUsernamesAction([username]));
  }
  if (isTransferUsernameTx(usernameTx)) {
    dispatch(removeUsernameAction(usernameTx.username));
  }
}

async function mayDispatchAccount(
  dispatch: Dispatch,
  accountTx: UnsignedTransaction,
  owner: Address,
): Promise<void> {
  if (isRegisterDomainTx(accountTx)) {
    const nowInMs = new Date().getTime();
    const accountRenewInMs = accountTx.accountRenew * 1000;
    // TODO not sure if precise, since getting from current time
    const expiryDate = new Date(nowInMs + accountRenewInMs);

    const account: BwAccount = {
      name: "",
      domain: accountTx.domain,
      expiryDate: expiryDate,
      addresses: [],
      owner: owner,
    };

    dispatch(addAccountsAction([account]));
  }

  if (isRegisterAccountTx(accountTx)) {
    const connection = await getConnectionForBns();
    const domains = await connection.getDomains({ name: accountTx.domain });
    if (domains.length !== 1) throw Error("Did not find unique domain");

    const account: BwAccount = {
      name: accountTx.name,
      domain: accountTx.domain,
      expiryDate: new Date(domains[0].validUntil * 1000),
      addresses: accountTx.targets,
      owner: accountTx.owner,
    };

    dispatch(addAccountsAction([account]));
  }

  if (isReplaceAccountTargetsTx(accountTx)) {
    const connection = await getConnectionForBns();
    const accounts = await connection.getAccounts({ name: `${accountTx.name}*${accountTx.domain}` });
    if (accounts.length !== 1) throw Error("Did not find unique account");

    const account: BwAccount = {
      name: accounts[0].name || "",
      domain: accounts[0].domain,
      expiryDate: new Date(accounts[0].validUntil * 1000),
      addresses: accounts[0].targets,
      owner: accounts[0].owner,
    };

    dispatch(addAccountsAction([account]));
  }

  if (isTransferAccountTx(accountTx)) {
    if (accountTx.newOwner !== owner) {
      dispatch(removeAccountAction(`${accountTx.name}*${accountTx.domain}`));
    }
  }

  if (isTransferDomainTx(accountTx)) {
    if (accountTx.newAdmin !== owner) {
      dispatch(removeAccountAction(`*${accountTx.domain}`));
    }
  }

  if (isDeleteDomainTx(accountTx)) {
    dispatch(removeAccountAction(`*${accountTx.domain}`));
  }

  if (isDeleteAccountTx(accountTx)) {
    dispatch(removeAccountAction(`${accountTx.name}*${accountTx.domain}`));
  }
}

let txsSubscriptions: Subscription[] = [];

export async function subscribeTransaction(
  identities: readonly Identity[],
  dispatch: Dispatch,
): Promise<void> {
  const config = await getConfig();
  const chains = config.chains;

  for (const chain of chains) {
    const connection = getConnectionForChainId(chain.chainSpec.chainId as ChainId);
    if (!connection) {
      continue;
    }
    const codec = getCodec(chain.chainSpec);
    const identity = identities.find(identity => identity.chainId === connection.chainId);
    if (!identity) {
      continue;
    }

    const address = codec.identityToAddress(identity);

    let lastTxTime = ReadonlyDate.now();

    // subscribe to balance changes via
    const subscription = connection.liveTx({ sentFromOrTo: address }).subscribe({
      next: async tx => {
        const bwTransaction = BwParserFactory.getBwTransactionFrom(tx);
        const parsedTx = await bwTransaction.parse(connection, tx, address);
        const currentTxTime = parsedTx.time.getTime();
        if (currentTxTime > lastTxTime) {
          lastTxTime = currentTxTime;
        }

        if (lastTxTime <= currentTxTime) {
          // Not required to process history transactions. Because we load all owned transaction
          // in src/store/accounts/actions.ts in getAccounts method
          mayDispatchUsername(dispatch, parsedTx.original);
          await mayDispatchAccount(dispatch, parsedTx.original, address);
        }
        dispatch(addTransaction(parsedTx));
      },
      error: error => console.error(error),
    });
    txsSubscriptions.push(subscription);
  }
}

export function unsubscribeTransactions(): void {
  txsSubscriptions.forEach(subs => subs.unsubscribe());
  txsSubscriptions = [];
}
