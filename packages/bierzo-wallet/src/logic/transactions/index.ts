import { ChainId, Identity, isFailedTransaction, UnsignedTransaction } from "@iov/bcp";
import {
  isRegisterAccountTx,
  isRegisterDomainTx,
  isRegisterUsernameTx,
  isReplaceAccountTargetsTx,
  isUpdateTargetsOfUsernameTx,
} from "@iov/bns";
import { Dispatch } from "redux";
import { Subscription } from "xstream";

import { getConfig } from "../../config";
import { addAccountsAction, BwAccount } from "../../store/accounts";
import { addTransaction } from "../../store/notifications";
import { addUsernamesAction, BwUsername } from "../../store/usernames";
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
}

async function mayDispatchAccount(dispatch: Dispatch, accountTx: UnsignedTransaction): Promise<void> {
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
    };

    dispatch(addAccountsAction([account]));
  }

  if (isRegisterAccountTx(accountTx)) {
    const connection = await getConnectionForBns();
    const domains = await connection.getDomains({ name: accountTx.domain });
    if (domains.length !== 1) throw Error("Did not find unique domain");

    const nowInMs = new Date().getTime();
    const accountRenewInMs = domains[0].accountRenew * 1000;
    // TODO not sure if precise, since getting from current time
    const expiryDate = new Date(nowInMs + accountRenewInMs);

    const account: BwAccount = {
      name: accountTx.name,
      domain: accountTx.domain,
      expiryDate: expiryDate,
      addresses: accountTx.targets,
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
    };

    dispatch(addAccountsAction([account]));
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

    // subscribe to balance changes via
    const subscription = connection.liveTx({ sentFromOrTo: address }).subscribe({
      next: async tx => {
        const bwTransaction = BwParserFactory.getBwTransactionFrom(tx);
        const parsedTx = await bwTransaction.parse(connection, tx, address);

        if (!isFailedTransaction(tx)) {
          mayDispatchUsername(dispatch, parsedTx.original);
          await mayDispatchAccount(dispatch, parsedTx.original);
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
