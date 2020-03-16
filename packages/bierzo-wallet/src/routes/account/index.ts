import AccountManage from "./manage";
import AccountRegister from "./register";
import AccountUpdate from "./update";

export type AccountEntity = "iovname" | "starname" | "name";

export interface AccountProps {
  entity: AccountEntity;
}

export { AccountManage, AccountRegister, AccountUpdate };
