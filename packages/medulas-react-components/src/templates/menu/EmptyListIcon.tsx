import { makeStyles, Theme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import Block from '../../components/Block';
import Img from '../../components/Image';

interface Props {
  readonly src: string;
  readonly alt: string;
  readonly text: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  empty: {
    marginBottom: theme.spacing(6),
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    marginBottom: theme.spacing(3),
    '& > span': {
      fontSize: '1.6rem',
    },
  },
}));

const EmptyListIcon = ({ src, alt, text }: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Block margin={2} />
      <ListItem className={classes.center}>
        <ListItemIcon className={classes.empty}>
          <Img src={src} alt={alt} height={42} />
        </ListItemIcon>
        <ListItemText primary={text} className={classes.text} />
      </ListItem>
    </React.Fragment>
  );
};

export default EmptyListIcon;
