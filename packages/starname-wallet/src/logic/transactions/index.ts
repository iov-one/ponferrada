/* function mayDispatchUsername(dispatch: Dispatch, usernameTx: UnsignedTransaction): void {
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
    const bnsConnection = await getConnectionForBns();
    const domainEntity = (await bnsConnection.getDomains({ name: accountTx.domain }))[0];
    const expiryDate = new Date(domainEntity.validUntil * 1000);

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
    } else {
      const connection = await getConnectionForBns();
      const accounts = await connection.getAccounts({ name: `${accountTx.name}*${accountTx.domain}` });
      if (accounts.length !== 1) throw Error("Did not find unique account");

      const account: BwAccount = {
        name: accounts[0].name || "",
        domain: accounts[0].domain,
        expiryDate: new Date(accounts[0].validUntil * 1000),
        addresses: accounts[0].targets,
        owner: accountTx.newOwner,
      };

      dispatch(addAccountsAction([account]));
    }
  }

  if (isTransferDomainTx(accountTx)) {
    if (accountTx.newAdmin !== owner) {
      dispatch(removeAccountAction(`*${accountTx.domain}`));
    }
  }

  if (isRenewDomainTx(accountTx)) {
    const bnsConnection = await getConnectionForBns();
    const domainEntity = (await bnsConnection.getDomains({ name: accountTx.domain }))[0];
    const expiryDate = new Date(domainEntity.validUntil * 1000);
    const accounts = await bnsConnection.getAccounts({ domain: domainEntity.domain });

    const updatedAccounts: BwAccount[] = accounts.map(accountNft => {
      return {
        name: accountNft.name || "",
        domain: accountNft.domain,
        expiryDate: expiryDate,
        addresses: accountNft.targets,
        owner: accountNft.owner,
      };
    });

    dispatch(addAccountsAction(updatedAccounts));
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
    const codec = getCodec(chain.chainSpec, config);
    const identity = identities.find(identity => identity.chainId === connection.chainId);
    if (!identity) {
      continue;
    }

    const address = codec.identityToAddress(identity);

    // subscribe to all transactions via
    const subscription = connection.liveTx({ sentFromOrTo: address }).subscribe({
      next: async tx => {
        const bwTransaction = BwParserFactory.getBwTransactionFrom(tx);
        const parsedTx = await bwTransaction.parse(connection, tx, address);

        dispatch(addTransaction(parsedTx));
      },
      error: error => console.error(error),
    });
    txsSubscriptions.push(subscription);

    if (connection instanceof BnsConnection) {
      // subscribe to all newly added transactions to update data realtime via
      const liveSubscription = connection.listenTx({ sentFromOrTo: address }).subscribe({
        next: async tx => {
          if (!isFailedTransaction(tx)) {
            mayDispatchUsername(dispatch, tx.transaction);
            await mayDispatchAccount(dispatch, tx.transaction, address);
          }
        },
        error: error => console.error(error),
      });
      txsSubscriptions.push(liveSubscription);
    }
  }
}

export function unsubscribeTransactions(): void {
  txsSubscriptions.forEach(subs => subs.unsubscribe());
  txsSubscriptions = [];
}*/
export const transactions = null;
