import { BwToken } from "store/tokens";

import { get, post, Task } from "./http";

const baseUrl = "https://iovnscli-rest-api.cluster-galaxynet.iov.one";

export interface Coin {
  denom: string;
  amount: number;
}

interface BalanceResponse {
  height: number;
  result: Coin[];
}

interface ApplicationVersion {
  build_tags: string;
  client_name: string;
  commit: string;
  go: string;
  name: string;
  server_name: string;
  version: string;
}

interface NodeInfo {
  channels: string;
  id: string;
  listen_addr: string;
  moniker: string;
  network: string;
  other: {
    tx_index: string;
    rpc_address: string;
  };
  protocol_version: {
    p2p: string;
    block: string;
    app: string;
  };
  version: string;
}

interface NodeInfoResponse {
  application_version: ApplicationVersion;
  node_info: NodeInfo;
}

export interface Target {
  id: string /* chain id */;
  address: string;
}

interface ResolveResponse {
  height: number;
  result: {
    account: Account;
  };
}

export interface Account {
  domain: string;
  name: string;
  owner: string;
  validUntil: number; // Unix timestamp
  broker?: string;
  targets: Target[];
  certificates: string[];
  metadataURI: string;
}

interface Msg {
  value: {
    from_address: string;
    to_address: string;
    amount: Coin[];
  };
}

export interface StdTx {
  msg: Msg[];
  fee: {
    gas: string;
    amount: Coin[];
  };
  memo: string;
  signature: {
    signature: string;
    pub_key: {
      type: string;
      value: string;
    };
    account_number: string;
    sequence: string;
  };
}

export enum TransactionDirection {
  Incoming,
  Outgoing,
}

export interface Transaction {
  txhash: string;
  height: number;
  tx: StdTx;
  direction: TransactionDirection;
  result: {
    log: string;
    gas_wanted: string;
    gas_used: string;
    tags: { key: string; value: string }[];
  };
}

interface TransactionsResponse {
  total_count: number;
  count: number;
  page_number: number;
  page_total: number;
  limit: number;
  txs: Transaction[];
}

export const Api = {
  getChainId: async (): Promise<string> => {
    const task: Task<NodeInfoResponse | undefined> = get<NodeInfoResponse>(baseUrl + "/node_info");
    const response: NodeInfoResponse | undefined = await task.run();
    if (response === undefined) return "invalid";
    // This is to make eslint happy
    const { node_info: nodeInfo } = response;
    return "cosmos:" + nodeInfo.network;
  },
  getTokens: async (): Promise<{ [ticker: string]: BwToken }> => {
    const chainId: string = await Api.getChainId();
    const IovToken: BwToken = {
      chainId: chainId,
      token: {
        tokenTicker: "IOV",
        fractionalDigits: 18,
      },
    };
    return {
      IOV: IovToken,
    };
  },
  getReceiveTransactions: async (address: string): Promise<TransactionsResponse> => {
    const task: Task<TransactionsResponse> = get<TransactionsResponse>(
      baseUrl + "/txs?message.action=send&transfer.recipient=" + address,
    );
    return task.run();
  },
  getSendTransactions: async (address: string): Promise<TransactionsResponse> => {
    const task: Task<TransactionsResponse> = get<TransactionsResponse>(
      baseUrl + "/txs?message.action=send&message.sender=" + address,
    );
    return task.run();
  },
  getTransactions: async (address: string): Promise<Transaction[]> => {
    const outgoing: TransactionsResponse = await Api.getReceiveTransactions(address);
    const incoming: TransactionsResponse = await Api.getSendTransactions(address);
    return [
      ...incoming.txs.map((tx: Transaction) => ({ ...tx, direction: TransactionDirection.Incoming })),
      ...outgoing.txs.map((tx: Transaction) => ({ ...tx, direction: TransactionDirection.Outgoing })),
    ];
  },
  getBalance: async (address: string): Promise<Coin[]> => {
    const task: Task<BalanceResponse> = get<BalanceResponse>(baseUrl + "/bank/balances/" + address);
    const response: BalanceResponse = await task.run();
    return response.result;
  },
  resolveStarname: (starname: string): Task<Account> => {
    const task: Task<ResolveResponse> = post<ResolveResponse>(baseUrl + "/starname/query/resolve", {
      starname,
    });
    return {
      run: async (): Promise<Account> => {
        const { result }: ResolveResponse = await task.run();
        return result.account;
      },
      abort: (): void => {
        task.abort();
      },
    };
  },
};
