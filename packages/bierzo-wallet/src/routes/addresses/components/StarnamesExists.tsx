import Paper from "@material-ui/core/Paper";
import { Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../..";
import starnameLogo from "../../../assets/starname-logo.svg";
import { BwAccount } from "../../../store/accounts";
import { NAME_MANAGE_ROUTE, STARNAME_MANAGE_ROUTE } from "../../paths";
import { registerStarnameId } from "./Starnames";

interface Props {
  readonly starnames: readonly BwAccount[];
  readonly onRegisterStarname: () => void;
}

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

function StarnamesExists({ starnames, onRegisterStarname }: Props): JSX.Element {
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
            <Image alt="Iovname Logo" src={starnameLogo} />
            <Block marginLeft={4} />
            <Typography variant="h5" align="center">
              Register a new starname
            </Typography>
          </Block>
          <Typography id={registerStarnameId} link color="primary" onClick={onRegisterStarname}>
            Register now
          </Typography>
        </Block>
      </Paper>
      {starnames
        .slice()
        .sort((a, b) =>
          `${a.name}*${a.domain}`.localeCompare(`${b.name}*${b.domain}`, undefined, { sensitivity: "base" }),
        )
        .map(starname => {
          const onManage = (): void => {
            if (starname.name) {
              history.push(NAME_MANAGE_ROUTE, starname);
            } else {
              history.push(STARNAME_MANAGE_ROUTE, starname);
            }
          };

          return (
            <React.Fragment key={`${starname.name}*${starname.domain}`}>
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
                  <Block display="flex" flexDirection="column">
                    <Typography variant="h5" weight="semibold">
                      {starname.name}*{starname.domain}
                    </Typography>
                    <Block marginTop={2} />
                    <Typography variant="subtitle2" weight="semibold" color="textPrimary">
                      Expires on {starname.expiryDate.toLocaleDateString()}{" "}
                      {starname.expiryDate.toLocaleTimeString()}
                    </Typography>
                  </Block>
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

export default StarnamesExists;
