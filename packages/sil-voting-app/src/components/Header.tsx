import Block from "medulas-react-components/lib/components/Block";
import CircleImage from "medulas-react-components/lib/components/Image/CircleImage";
import Typography from "medulas-react-components/lib/components/Typography";
import React from "react";

import icon from "../assets/iov-logo.svg";

export const HEADER_HTML_ID = "header";

const Header = (): JSX.Element => {
  return (
    <Block id={HEADER_HTML_ID} width="100%" minHeight="78px" display="flex" alignItems="center">
      <Block minWidth="205px" display="flex" alignItems="center" justifyContent="center">
        <CircleImage alt="Logo" icon={icon} dia="48px" circleColor="#fff" />
        <Block marginLeft={2}>
          <Typography variant="h5">IOV</Typography>
        </Block>
      </Block>
      <Typography variant="h5">Voting Dashboard</Typography>
    </Block>
  );
};

export default Header;
