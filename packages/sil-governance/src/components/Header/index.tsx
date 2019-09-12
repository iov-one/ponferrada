import { Block, CircleImage, Typography } from "medulas-react-components";
import React from "react";
import { useSelector } from "react-redux";

import icon from "../../assets/iov-logo.svg";
import { RootState } from "../../store/reducers";

export const HEADER_HTML_ID = "header";

const Header = (): JSX.Element => {
  const governor = useSelector((state: RootState) => state.extension.governor);
  if (!governor) throw new Error("Governor not set in store. This is a bug.");

  return (
    <React.Fragment>
      <Block
        id={HEADER_HTML_ID}
        width="100%"
        minHeight="78px"
        marginBottom={-2}
        display="flex"
        alignItems="center"
      >
        <Block minWidth="205px" display="flex" alignItems="center" justifyContent="center">
          <CircleImage alt="Logo" icon={icon} dia="48px" circleColor="#fff" />
          <Block marginLeft={2}>
            <Typography variant="h5">IOV</Typography>
          </Block>
        </Block>
        <Typography variant="h5">Governance</Typography>
      </Block>
      <Block marginRight={4} display="flex" flexDirection="column" alignItems="flex-end">
        <Typography variant="body2">My address: {governor.address}</Typography>
      </Block>
    </React.Fragment>
  );
};

export default Header;
