import { Address } from "@iov/bcp";
import { Electorate } from "@iov/bns";
import { Block, CircleImage, Typography } from "medulas-react-components";
import React from "react";

import iovIcon from "../../assets/iov-logo.svg";
import userIcon from "../../assets/user.svg";

export const HEADER_HTML_ID = "header";

interface Props {
  readonly address: Address;
  readonly electorates: readonly Electorate[];
}

const Header = ({ address, electorates }: Props): JSX.Element => {
  return (
    <Block id={HEADER_HTML_ID} width="100%" minHeight="78px" display="flex" alignItems="center">
      <Block minWidth="205px" display="flex" alignItems="center" justifyContent="center">
        <CircleImage alt="Logo" icon={iovIcon} dia="48px" circleColor="#fff" />
        <Block marginLeft={2}>
          <Typography variant="h5">IOV</Typography>
        </Block>
      </Block>
      <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Governance</Typography>
        <Block marginRight={4} display="flex" alignItems="center">
          <Block textAlign="right">
            <Typography variant="body2">{address}</Typography>
            <Typography variant="body2">Member of {electorates.map(e => e.title).join(", ")}</Typography>
          </Block>
          <Block marginLeft={1}>
            <CircleImage alt="Logo" icon={userIcon} dia="32px" circleColor="#fff" />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Header;
