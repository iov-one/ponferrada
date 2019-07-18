import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { useState } from 'react';

import { history } from '../routes';
import { CREATE_PROPOSAL_ROUTE } from '../routes/paths';

export const ASIDE_FILTER_HTML_ID = 'aside-filter';

const useStyles = makeStyles({
  drawerPaper: {
    position: 'relative',
    border: 'none',
  },
  list: {
    border: 'none',
  },
  activeFilter: {
    backgroundColor: '#d8d8d8',
  },
});

const handleClick = (): void => {
  history.push(CREATE_PROPOSAL_ROUTE);
};

const AsideFilter = (): JSX.Element => {
  const classes = useStyles();
  const [activeFilter] = useState('All Elections');

  const paperClasses = {
    paper: classes.drawerPaper,
  };
  const listClasses = {
    root: classes.list,
  };
  const filterClasses = {
    root: classes.activeFilter,
  };

  return (
    <Block id={ASIDE_FILTER_HTML_ID} minWidth="205px">
      <Drawer variant="permanent" classes={paperClasses}>
        <List classes={listClasses}>
          {['All Elections', 'Active Elections', 'Submitted Elections', 'Ended Elections'].map(text => (
            <ListItem button key={text} classes={activeFilter === text ? filterClasses : undefined}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Typography onClick={handleClick}>+ Add New Proposal</Typography>
    </Block>
  );
};

export default AsideFilter;
