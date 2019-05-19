import Block from 'medulas-react-components/lib/components/Block';
import Link from 'medulas-react-components/lib/components/Link';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { RESTORE_ACCOUNT } from '../../paths';

const LoginControls = (): JSX.Element => {
  return (
    <Block marginTop={4} textAlign="center">
      <Block marginBottom={1}>
        <Link to={RESTORE_ACCOUNT}>
          <Typography variant="subtitle2" color="primary" link inline>
            Restore account
          </Typography>
        </Link>
      </Block>
    </Block>
  );
};

export default LoginControls;
