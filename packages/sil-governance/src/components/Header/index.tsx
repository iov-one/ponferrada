import { Electorate } from "@iov/bns";
import { Block, CircleImage, Typography } from "medulas-react-components";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import iovIcon from "../../assets/iov-logo.svg";
import userIcon from "../../assets/user.svg";
import { RootState } from "../../store/reducers";

export const HEADER_HTML_ID = "header";

const Header = (): JSX.Element => {
  const governor = useSelector((state: RootState) => state.extension.governor);
  if (!governor) throw new Error("Governor not set in store. This is a bug.");

  const [electorates, setElectorates] = useState<Readonly<Electorate[]>>([]);

  useEffect(() => {
    const updateElectorates = async (): Promise<void> => {
      const electorates = await governor.getElectorates();
      setElectorates(electorates);
    };
    updateElectorates();
  }, [governor]);

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
            <Typography variant="body2">{governor.address}</Typography>
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
