import Paper from "@material-ui/core/Paper";
import { Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../..";
import iovnameLogo from "../../../assets/iovname-logo.svg";
import { BwAccount } from "../../../store/accounts";
import { IOVNAME_MANAGE_ROUTE } from "../../paths";
import { registerIovnameId } from "./Iovnames";

interface Props {
  readonly iovnames: readonly BwAccount[];
  readonly onRegisterIovname: () => void;
}

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
    height: "100%",
  },
  elevation1: {
    boxShadow: "none",
  },
});

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
          <Typography id={registerIovnameId} link color="primary" onClick={onRegisterIovname}>
            Register now
          </Typography>
        </Block>
      </Paper>
      {iovnames
        .slice()
        .sort((a, b) =>
          `${a.name}*${a.domain}`.localeCompare(`${b.name}*${b.domain}`, undefined, { sensitivity: "base" }),
        )
        .map(iovname => {
          const onManage = (): void => {
            history.push(IOVNAME_MANAGE_ROUTE, iovname);
          };

          return (
            <React.Fragment key={`${iovname.name}*${iovname.domain}`}>
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
                    {iovname.name}*{iovname.domain}
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
