import { Amount } from "@iov/bcp";
import { Block } from "medulas-react-components";
import * as React from "react";

import SimplePageLayout from "../../components/SimplePageLayout";
import ListCollectibles from "./components/ListCollectibles";
import ListTokens from "./components/ListTokens";
import SidePanel from "./components/SidePanel";

const AccountView = (): JSX.Element => {
  // const persona = useContext(PersonaContext);
  // console.log(persona.accounts);
  const balances: { [tokenTicker: string]: Amount } = {};
  // TODO load balances indexed object
  /* persona.balances.forEach(token => {
    balances[token.tokenTicker] = {
      quantity: token.quantity,
      fractionalDigits: token.fractionalDigits,
      tokenTicker: token.tokenTicker,
    };
  }); */

  // TODO load from chain when iov-core API ready
  const starnames: string[] = [];
  const awards: string[] = [];

  return (
    <SidePanel>
      <SimplePageLayout>
        <Block marginTop={3} />
        <ListTokens balances={balances} />
        <Block marginTop={3} />
        <ListCollectibles starnames={starnames} awards={awards} />
        <Block marginTop={3} />
      </SimplePageLayout>
    </SidePanel>
  );
};

export default AccountView;
