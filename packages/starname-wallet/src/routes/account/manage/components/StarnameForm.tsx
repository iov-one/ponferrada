import { ActionMenuItem, Block } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import {
  NAME_EDIT_ROUTE,
  NAME_REGISTER_ROUTE,
  STARNAME_DELETE_ROUTE,
  STARNAME_RENEW_ROUTE,
  STARNAME_TRANSFER_ROUTE,
} from "../../../paths";
import AssociatedNamesList from "./AssociatedNamesList";

export const STARNAME_MANAGE_VIEW = "starname-manage-view";

const StarnameAccountManage = (): JSX.Element => {
  const [domainAccounts, setDomainAccounts] = React.useState<BwAccountWithChainName[]>([]);
  const account: BwAccountWithChainName = history.location.state;

  const menuItems: readonly ActionMenuItem[] = [
    { title: "Renew", action: () => history.push(STARNAME_RENEW_ROUTE, account) },
    { title: "Transfer starname", action: () => history.push(STARNAME_TRANSFER_ROUTE, account) },
    { title: "Delete starname", action: () => history.push(STARNAME_DELETE_ROUTE, account) },
  ];

  /*React.useEffect(() => {
    let isSubscribed = true;
    async function getDomainAccounts(): Promise<void> {
      const connection = await getConnectionForBns();
      const accountsNft = await connection.getAccounts({ domain: account.domain });
      if (isSubscribed) {
        const bwAccountsWithChain: BwAccountWithChainName[] = await Promise.all(
          accountsNft
            .filter(nft => nft.name)
            .map(async nft => {
              return {
                name: nft.name ? nft.name : "",
                domain: nft.domain,
                expiryDate: new Date(nft.validUntil * 1000),
                owner: nft.owner,
                addresses: await Promise.all(
                  nft.targets.map(async address => {
                    return {
                      chainId: address.chainId,
                      address: address.address,
                      chainName: await getChainName(address.chainId),
                    };
                  }),
                ),
              };
            }),
        );
        setDomainAccounts(bwAccountsWithChain);
      }
    }
    getDomainAccounts();

    return () => {
      isSubscribed = false;
    };
  }, [account]);*/

  const onEdit = (): void => {
    history.push(NAME_EDIT_ROUTE, account);
  };

  const onRegisterName = (): void => {
    history.push(NAME_REGISTER_ROUTE);
  };

  return (
    <Block data-test={STARNAME_MANAGE_VIEW}>
      <AccountManage menuItems={menuItems} onEdit={onEdit} account={account} />
      <AssociatedNamesList domain={account} names={domainAccounts} onRegisterName={onRegisterName} />
    </Block>
  );
};

export default StarnameAccountManage;
