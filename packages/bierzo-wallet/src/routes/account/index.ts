import AccountDelete from "./delete";
import AccountManage from "./manage";
import AccountRegister from "./register";
import AccountUpdate from "./update";

export type AccountEntity = "iovname" | "starname" | "name" | "name-back";

export interface AccountProps {
  entity: AccountEntity;
}

export { AccountManage, AccountRegister, AccountUpdate, AccountDelete };
