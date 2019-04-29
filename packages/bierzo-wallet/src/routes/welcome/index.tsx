import { Avatar, Button, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Image from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import avatar from '../../assets/iov-logo.svg';
import { history } from '../../store/reducers';
import { PAYMENT_ROUTE } from '../paths';

const useStyles = makeStyles((theme: Theme) => ({
  welcome: {
    backgroundColor: theme.palette.background.default,
    width: '100vw',
    height: 'auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    placeContent: 'center',
  },

  avatarRoot: {
    backgroundColor: theme.palette.primary.main,
    width: '200px',
    height: '200px',
  },

  avatarIcon: {
    width: '50%',
  },

  heading: {
    margin: '40px 0 40px 0',
    fontSize: '20px',
  },

  buttonRoot: {
    width: '150px',
  },
}));

const handleClick = () => {
  history.push(PAYMENT_ROUTE);
};

export const Welcome = () => {
  const classes = useStyles();

  const avatarClasses = {
    root: classes.avatarRoot,
  };

  const buttonClasses = {
    root: classes.buttonRoot,
  };

  return (
    <Block className={classes.welcome}>
      <Avatar classes={avatarClasses}>
        <Image alt="Logo" className={classes.avatarIcon} src={avatar} />
      </Avatar>
      <Typography className={classes.heading} variant="h1">
        IOV Wallet
      </Typography>
      <Button classes={buttonClasses} onClick={handleClick}>
        NEXT
      </Button>
    </Block>
  );
};
