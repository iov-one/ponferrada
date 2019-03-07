import { Button } from 'medulas-react-components/lib/components/Button';
import { Typography } from 'medulas-react-components/lib/components/Typography';
import { Block } from 'medulas-react-components/lib/components/Block';
import * as React from 'react';

const Layout = (): JSX.Element => (
  <Block padding={4}>
    <Typography color="primary" inline>
      Welcome
    </Typography>
    &nbsp;<Typography inline>to your IOV manager</Typography>
    <Button type="contained">Hii Albert</Button>
  </Block>
);

export default Layout;
