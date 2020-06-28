import Paper from "@material-ui/core/Paper";
import { Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { REGISTER_IOVNAME_LINK } from "..";
import { history } from "../..";
import iovnameLogo from "../../../assets/iovname-logo.svg";
import { BwUsernameWithChainName } from "../../../components/AccountManage";
import { IOVNAME_MANAGE_ROUTE } from "../../paths";

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
    height: "100%",
  },
  elevation1: {
    boxShadow: "none",
  },
});

interface Props {
  readonly iovnames: readonly BwUsernameWithChainName[];
  readonly onRegisterIovname: () => void;
}

function IovnamesExists({ iovnames, onRegisterIovname }: Props): JSX.Element {
  const paperClasses = usePaper();

  return (
    <React.Fragment>
      <Paper classes={paperClasses}>
        <Block
          width={650}
          padding={5}
          border="1px solid #F3F3F3"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Block display="flex" alignItems="center">
            <Image alt="Iovname Logo" src={iovnameLogo} />
            <Block marginLeft={4} />
            <Typography variant="h5" align="center">
              Register a new iovname
            </Typography>
          </Block>
          <Typography id={REGISTER_IOVNAME_LINK} link color="primary" onClick={onRegisterIovname}>
            Register now
          </Typography>
        </Block>
      </Paper>
      {iovnames
        .slice()
        .sort((a, b) => a.username.localeCompare(b.username, undefined, { sensitivity: "base" }))
        .map(iovname => {
          const onManage = (): void => {
            history.push(IOVNAME_MANAGE_ROUTE, iovname);
          };

          return (
            <React.Fragment key={iovname.username}>
              <Block marginTop={3} />
              <Paper classes={paperClasses}>
                <Block
                  width={650}
                  padding={5}
                  border="1px solid #F3F3F3"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h5" weight="semibold">
                    {iovname.username}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    weight="semibold"
                    inline
                    link
                    color="primary"
                    onClick={onManage}
                  >
                    Manage
                  </Typography>
                </Block>
              </Paper>
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
}

export default IovnamesExists;
