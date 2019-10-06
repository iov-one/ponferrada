import { Address } from "@iov/bcp";
import { Electorate } from "@iov/bns";
import { Block, CircleImage, Image, makeStyles, Typography } from "medulas-react-components";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import iovLogo from "../../assets/iov-logo-title.svg";
import userIcon from "../../assets/user.svg";
import { SHOW_ELECTORATE_ROUTE } from "../../routes/paths";

export const HEADER_HTML_ID = "header";

const useStyles = makeStyles({
  commaSeparator: {
    "& > p + p:before": {
      content: `", "`,
    },
  },
  electorateLink: {
    "&, &:visited": {
      color: "black",
    },
  },
});

interface Props {
  readonly address: Address;
  readonly electorates: readonly Electorate[];
}

const Header = ({ address, electorates }: Props): JSX.Element => {
  const classes = useStyles();

  const ElectorateLinks = useMemo(
    () => (): JSX.Element => {
      return (
        <Block display="inline" className={classes.commaSeparator}>
          {electorates.map(e => (
            <Typography inline variant="body2" key={e.id}>
              <Link to={`${SHOW_ELECTORATE_ROUTE}/${e.id}`} className={classes.electorateLink}>
                {e.title}
              </Link>
            </Typography>
          ))}
        </Block>
      );
    },
    [classes.commaSeparator, classes.electorateLink, electorates],
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
