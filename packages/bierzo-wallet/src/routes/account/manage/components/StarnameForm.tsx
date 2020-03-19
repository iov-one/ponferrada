import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import { getChainName } from "../../../../config";
import { getConnectionForBns } from "../../../../logic/connection";
import { NAME_EDIT_ROUTE, NAME_REGISTER_ROUTE, STARNAME_TRANSFER_ROUTE } from "../../../paths";
import AssociatedNamesList from "./AssociatedNamesList";

const StarnameAccountManage = (): JSX.Element => {
  const [domainAccounts, setDomainAccounts] = React.useState<BwAccountWithChainName[]>([]);
  const account: BwAccountWithChainName = history.location.state;

  const menuItems: readonly ActionMenuItem[] = [
    // eslint-disable-next-line no-console
    { title: "Renew", action: () => console.log("Renew") },
    // eslint-disable-next-line no-console
    { title: "Transfer starname", action: () => history.push(STARNAME_TRANSFER_ROUTE, account) },
    // eslint-disable-next-line no-console
    { title: "Delete starname", action: () => console.log("Delete starname") },
  ];

  React.useEffect(() => {
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
  }, [account]);

  const onEdit = (): void => {
    history.push(NAME_EDIT_ROUTE, account);
  };

  const onRegisterName = (): void => {
    history.push(NAME_REGISTER_ROUTE);
  };

  return (
    <React.Fragment>
      <AccountManage menuItems={menuItems} onEdit={onEdit} account={account} />
      <AssociatedNamesList names={domainAccounts} onRegisterName={onRegisterName} />
    </React.Fragment>
  );
};

export default StarnameAccountManage;
