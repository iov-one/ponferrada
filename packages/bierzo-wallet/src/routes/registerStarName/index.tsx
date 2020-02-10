import { Block, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import PageMenu from "../../components/PageMenu";

const useStyles = makeStyles({
  usernameHeader: {
    boxShadow: "0px 0px 14px #EDEFF4",
  },
});

// TODO move to components when implemented, mirroring registerName
export function NoStarnameHeader(): JSX.Element {
  const classes = useStyles();
  return (
    <Block className={classes.usernameHeader} borderRadius={40} width={145} padding={1}>
      <Typography variant="subtitle1" weight="semibold" color="primary" align="center">
        *yourstarname
      </Typography>
    </Block>
  );
}

const RegisterStarname = (): JSX.Element => {
  return (
    <PageMenu>
      <Block textAlign="center">
        <Typography>Register new starname. Work in progress view</Typography>
      </Block>
    </PageMenu>
  );
};

export default RegisterStarname;
