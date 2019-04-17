import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { ListItem, ListItemIcon, ListItemText } from 'medulas-react-components/lib/components/List';
import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';

interface Props {
  readonly src: string;
  readonly alt: string;
  readonly text: string;
}

const useStyles = makeStyles(theme => ({
  empty: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    marginBottom: theme.spacing(3),
    '& > span': {
      fontSize: theme.typography.h5.fontsize,
    },
  },
}));

const EmptyListIcon = ({ src, alt, text }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Block margin="md" />
      <ListItem className={classes.center}>
        <ListItemIcon className={classes.empty}>
          <Img src={src} alt={alt} height="42" />
        </ListItemIcon>
        <ListItemText primary={text} className={classes.text} />
      </ListItem>
    </React.Fragment>
  );
};

export default EmptyListIcon;
