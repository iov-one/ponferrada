import { BwAccountWithChainName } from "../../components/AccountManage";
import AccountDelete from "./delete";
import AccountManage from "./manage";
import AccountRegister from "./register";
import AccountRenew from "./renew";
import AccountUpdate from "./update";

export type AccountEntity = "iovname" | "starname" | "name";

export interface AccountProps {
  entity: AccountEntity;
}

export interface AccountLocationState {
  readonly domain?: BwAccountWithChainName;
  readonly account: BwAccountWithChainName;
}

export { AccountManage, AccountRegister, AccountUpdate, AccountDelete, AccountRenew };
