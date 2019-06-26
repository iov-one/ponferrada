import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import React from 'react';

const useStyles = makeStyles(() => ({
  drawerPaper: {
    position: 'relative',
    border: 'none',
  },
  list: {
    border: 'none',
  },
}));

const AsideFilter = (): JSX.Element => {
  const classes = useStyles();
  const paperClasses = {
    paper: classes.drawerPaper,
  };
  const listClasses = {
    root: classes.list,
  };

  return (
    <Block minWidth="205px">
      <Drawer variant="permanent" classes={paperClasses}>
        <List classes={listClasses}>
          {['All Elections', 'Active Elections', 'Submitted Elections', 'Ended Elections'].map(text => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Block>
  );
};

export default AsideFilter;
