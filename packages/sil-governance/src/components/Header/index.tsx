import { Address } from "@iov/bcp";
import { Electorate } from "@iov/bns";
import { Block, CircleImage, Image, Typography } from "medulas-react-components";
import React, { useMemo } from "react";

import iovLogo from "../../assets/iov-logo-title.svg";
import userIcon from "../../assets/user.svg";
import { history } from "../../routes";
import { SHOW_ELECTORATE_ROUTE } from "../../routes/paths";

export const HEADER_HTML_ID = "header";

const navigateToElectorate = (id: number): void => {
  const target = `${SHOW_ELECTORATE_ROUTE}/${id}`;
  if (history.location.pathname !== target) {
    history.push(target);
  }
};

interface Props {
  readonly address: Address;
  readonly electorates: readonly Electorate[];
}

const Header = ({ address, electorates }: Props): JSX.Element => {
  const ElectorateLinks = useMemo(
    () => (): JSX.Element => (
      <React.Fragment>
        {electorates.map((e, index) => (
          <Block display="inline" key={e.id}>
            <Typography inline link variant="body2" onClick={() => navigateToElectorate(e.id)}>
              {e.title}
            </Typography>
            {index !== 1 && (
              <Typography inline variant="body2">
                ,{" "}
              </Typography>
            )}
          </Block>
        ))}
      </React.Fragment>
    ),
    [electorates],
  );

  const hasElectorates = electorates.length > 0;

  return (
    <Block id={HEADER_HTML_ID} width="100%" minHeight="78px" display="flex" alignItems="center">
      <Block minWidth="205px" display="flex" alignItems="center" justifyContent="center">
        <Image alt="Logo" src={iovLogo} height="64px" />
      </Block>
      <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Governance</Typography>
        <Block marginRight={4} display="flex" alignItems="center">
          <Block textAlign="right">
            <Typography variant="body2">{address}</Typography>
            {hasElectorates && (
              <React.Fragment>
                <Typography inline variant="body2">
                  Member of{" "}
                </Typography>
                <ElectorateLinks />
              </React.Fragment>
            )}
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
