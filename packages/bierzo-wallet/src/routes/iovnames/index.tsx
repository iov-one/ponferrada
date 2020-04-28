import { Block } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { BwUsernameWithChainName } from "../../components/AccountManage";
import PageMenu from "../../components/PageMenu";
import { getChainName } from "../../config";
import { RootState } from "../../store/reducers";
import { IOVNAME_REGISTER_ROUTE } from "../paths";
import IovnamesExists from "./components/IovnamesExists";
import IovnamesNotExists from "./components/IovnamesNotExists";

export const IOVNAMES_VIEW_ID = "iovnames-view-id";
export const REGISTER_IOVNAME_LINK = IOVNAME_REGISTER_ROUTE.replace(/\//g, "-");

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

function Iovnames(): JSX.Element {
  const iovnames = ReactRedux.useSelector((state: RootState) => state.usernames);
  const [iovnamesWithChain, setIovnamesWithChain] = React.useState<readonly BwUsernameWithChainName[]>([]);

  React.useEffect(() => {
    let isSubscribed = true;
    async function insertChainNames(): Promise<void> {
      if (isSubscribed) {
        const bwUsernamesWithChain: BwUsernameWithChainName[] = await Promise.all(
          iovnames.map(async name => {
            return {
              username: name.username,
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

        setIovnamesWithChain(bwUsernamesWithChain);
      }
    }
    insertChainNames();

    return () => {
      isSubscribed = false;
    };
  }, [iovnames]);

  const hasIovnames = iovnamesWithChain.length > 0;

  return (
    <PageMenu>
      <Block
        id={IOVNAMES_VIEW_ID}
        marginTop={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {hasIovnames && <IovnamesExists iovnames={iovnamesWithChain} onRegisterIovname={onRegisterIovname} />}
        {!hasIovnames && <IovnamesNotExists onRegisterIovname={onRegisterIovname} />}
      </Block>
    </PageMenu>
  );
}

export default Iovnames;
