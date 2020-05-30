import { Block, Link, Typography } from "medulas-react-components";
import * as React from "react";

import { RESTORE_WALLET } from "../../paths";

const UnlockControls = (): JSX.Element => {
  return (
    <Block marginTop={4} textAlign="center">
      <Block marginBottom={1}>
        <Link to={RESTORE_WALLET}>
          <Typography variant="subtitle2" color="primary" link inline>
            Restore wallet
          </Typography>
        </Link>
      </Block>
    </Block>
  );
};

export default UnlockControls;
