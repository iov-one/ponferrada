import * as React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import selectedTick from '../../../theme/assets/selectField/selectedTick.svg';
import Block from '../../Block';
import Hairline from '../../Hairline';
import Img from '../../Image';
import Typography from '../../Typography';
import { Item } from './index';

interface ListItemProps {
  readonly action: (value: Item) => () => void;
  readonly selectedItem: string;
  readonly items: ReadonlyArray<Item>;
}

const ListItems = ({ action, items, selectedItem }: ListItemProps): JSX.Element => {
  return (
    <List component="nav">
      {items.map(
        (item): JSX.Element => (
          <Block key={item.name}>
            <ListItem key={item.name} button onClick={action(item)}>
              <ListItemText
                disableTypography
                primary={<Typography variant="body1">{item.name}</Typography>}
                secondary={<Typography color="textSecondary">{item.additionalText}</Typography>}
              />
              {item.name === selectedItem && (
                <Img src={selectedTick} alt="Selected Ticker" width={24} height={24} />
              )}
            </ListItem>
            <Hairline />
          </Block>
        ),
      )}
    </List>
  );
};

export default ListItems;
