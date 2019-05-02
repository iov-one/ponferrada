import * as React from 'react';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import Link from 'medulas-react-components/lib/components/Link';
import { RESTORE_ACCOUNT, WELCOME_ROUTE } from '../../paths';

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
      <Block>
        <Link to={WELCOME_ROUTE}>
          <Typography variant="subtitle2" color="primary" link inline>
            More options
          </Typography>
        </Link>
      </Block>
    </Block>
  );
};

export default LoginControls;
