import { BwToken } from "store/tokens";

const baseUrl: string = "https://iovnscli-rest-api.cluster-galaxynet.iov.one";

export interface Task<T> {
  abort: () => void;
  run: () => Promise<T>;
}

const request = <T>(method: "GET" | "POST", url: string, data?: any): Task<T> => {
  const xhr: XMLHttpRequest = new XMLHttpRequest();
  const run: () => Promise<T> = () =>
    new Promise<T>((resolve: (data: T | undefined) => void, reject: (reason: any) => void) => {
      xhr.open(method, url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return; // Ignore progress or other states for now
        if (xhr.status >= 400) {
          reject({
            status: xhr.status,
            data: JSON.parse(xhr.responseText),
          });
        } else if (xhr.status >= 200 && xhr.status < 300) {
          // Good one!
          const response: any = JSON.parse(xhr.responseText);
          resolve(response as T);
        } else {
          // Something else that we don't want
        }
      };
      xhr.onabort = () => reject("aborted");
      if (data !== undefined) {
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  return {
    run: run,
    abort: () => {
      console.log("aborting request");
      xhr.abort();
    },
  };
};

const post = <T>(url: string, data: any) => request<T>("POST", url, data);
const get = <T>(url: string) => request<T>("GET", url);

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

interface SupplyTotal {
  denom: string;
  amount: string;
}

interface SupplyTotalResponse {
  height: string;
  result: readonly SupplyTotal[];
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

export const Api = {
  getChainId: async (): Promise<string> => {
    const task: Task<NodeInfoResponse | undefined> = get<NodeInfoResponse>(baseUrl + "/node_info");
    const response: NodeInfoResponse | undefined = await task.run();
    if (response === undefined) return "invalid";
    const { node_info } = response;
    return "cosmos:" + node_info.network;
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
  resolveStarname: (starname: string): Task<Account> => {
    const task: Task<ResolveResponse> = post<ResolveResponse>(baseUrl + "/starname/query/resolve", {
      starname,
    });
    return {
      run: async (): Promise<Account> => {
        const { result }: ResolveResponse = await task.run();
        return result.account;
      },
      abort: () => {
        task.abort();
      },
    };
  },
};
