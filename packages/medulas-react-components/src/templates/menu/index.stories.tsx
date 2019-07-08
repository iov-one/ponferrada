import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Down from '@material-ui/icons/KeyboardArrowDown';
import Up from '@material-ui/icons/KeyboardArrowUp';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Block from '../../components/Block';
import Typography from '../../components/Typography';
import noPendingTxs from '../../theme/assets/icons/noPendingTxs.svg';
import { Storybook } from '../../utils/storybook';
import EmptyListIcon from './EmptyListIcon';
import ListMenu from './ListMenu';

const starter = (open: boolean): JSX.Element => {
  const text = `Menu is ${open ? 'opened' : 'closed'}`;

  return (
    <Block>
      <Typography variant="h6">Hi! {text}</Typography>
      {open ? <Up fontSize="large" /> : <Down fontSize="large" />}
    </Block>
  );
};

const MenuItem = ({ msg }: { msg: string }): JSX.Element => (
  <ListItem disableGutters button>
    <ListItemText disableTypography>
      <Typography variant="body2">{msg}</Typography>
    </ListItemText>
  </ListItem>
);

storiesOf('Templates/Menu', module).add(
  'List Menu',
  (): JSX.Element => (
    <Storybook>
      <Block display="flex" marginTop={3}>
        <Block flexGrow={3} />
        <ListMenu starter={starter} listWidth={60}>
          <MenuItem msg="Foo" />
          <MenuItem msg="Bar" />
          <MenuItem msg="Baz" />
        </ListMenu>
        <Block flexGrow={1} />
      </Block>
    </Storybook>
  ),
);

storiesOf('Templates/Menu', module).add(
  'Empty Menu',
  (): JSX.Element => (
    <Storybook>
      <Block display="flex" marginTop={3}>
        <Block flexGrow={3} />
        <ListMenu starter={starter} listWidth={200}>
          <EmptyListIcon src={noPendingTxs} alt="No Pending Transactions" text="You are up to date!" />
        </ListMenu>
        <Block flexGrow={1} />
      </Block>
    </Storybook>
  ),
);
