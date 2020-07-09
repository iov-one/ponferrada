import { Block } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { BwAccountWithChainName } from "../../components/AccountManage";
import PageMenu from "../../components/PageMenu";
import { getChainName } from "../../config";
import { RootState } from "../../store/reducers";
import { STARNAME_REGISTER_ROUTE } from "../paths";
import StarnamesExists from "./components/StarnamesExists";
import StarnamesNotExists from "./components/StarnamesNotExists";

export const STARNAMES_VIEW_ID = "starnames-view-id";
export const REGISTER_STARNAME_LINK = STARNAME_REGISTER_ROUTE.replace(/\//g, "-");

function onRegisterStarname(): void {
  history.push(STARNAME_REGISTER_ROUTE);
}

function Starnames(): JSX.Element {
  const starnames = ReactRedux.useSelector((state: RootState) => state.accounts);
  const [starnamesWithChain, setStarnamesWithChain] = React.useState<readonly BwAccountWithChainName[]>([]);

  React.useEffect(() => {
    let isSubscribed = true;
    async function insertChainNames(): Promise<void> {
      if (isSubscribed) {
        const bwAccountsWithChain: BwAccountWithChainName[] = await Promise.all(
          starnames.map(async name => {
            return {
              ...name,
              addresses: await Promise.all(
                name.addresses.map(async address => {
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

        setStarnamesWithChain(bwAccountsWithChain);
      }
    }
    insertChainNames();

    return () => {
      isSubscribed = false;
    };
  }, [starnames]);

  const hasStarnames = starnamesWithChain.length > 0;

  return (
    <PageMenu>
      <Block
        id={STARNAMES_VIEW_ID}
        marginTop={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {hasStarnames ? (
          <StarnamesExists starnames={starnamesWithChain} onRegisterStarname={onRegisterStarname} />
        ) : (
          <StarnamesNotExists onRegisterStarname={onRegisterStarname} />
        )}
      </Block>
    </PageMenu>
  );
}

export default Starnames;
