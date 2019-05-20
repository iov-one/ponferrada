import { makeStyles, Theme } from '@material-ui/core';
import CompareArrows from '@material-ui/icons/CompareArrows';
import Avatar from 'medulas-react-components/lib/components/Avatar';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import { List, ListItem, ListItemAvatar, ListItemText } from 'medulas-react-components/lib/components/List';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { Request } from '../../../extension/background/actions/createPersona/requestHandler';

interface Props {
  readonly requests: ReadonlyArray<Request>;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: 'none',
  },
  avatar: {
    height: '35px',
    width: '35px',
    backgroundColor: theme.palette.primary.main,
  },
  first: {
    cursor: 'pointer',
  },
}));

const RequestList = ({ requests }: Props): JSX.Element => {
  const classes = useStyles();
  const secondaryProps = {
    color: 'textPrimary',
  };

  return (
    <React.Fragment>
      <Block marginBottom={3}>
        <Typography variant="subtitle2" color="textPrimary">
          Remember! Transactions should be resolved in order!
        </Typography>
      </Block>
      <List className={classes.root}>
        {requests.map((req: Request, index: number) => {
          const first = index === 0;
          const firstElemClass = first ? classes.first : undefined;

          return (
            <React.Fragment>
              <ListItem key={`${index}`} className={firstElemClass} disabled={!first}>
                <ListItemText
                  primary="Type of request"
                  secondary={req.reason}
                  secondaryTypographyProps={secondaryProps}
                />
                {first && (
                  <ListItemAvatar>
                    <Avatar color="primary" className={classes.avatar}>
                      <CompareArrows />
                    </Avatar>
                  </ListItemAvatar>
                )}
              </ListItem>
              {first && <Hairline />}
            </React.Fragment>
          );
        })}
      </List>
    </React.Fragment>
  );
};

export default RequestList;
