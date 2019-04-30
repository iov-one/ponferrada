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
  },

  avatar: {
    backgroundColor: theme.palette.primary.main,
    width: '200px',
    height: '200px',
  },

  button: {
    width: '150px',
  },
}));

const handleClick = () => {
  history.push(PAYMENT_ROUTE);
};

export const Welcome = () => {
  const classes = useStyles();

  const avatarClasses = {
    root: classes.avatar,
  };

  const buttonClasses = {
    root: classes.button,
  };

  return (
    <Block
      width="100vw"
      height="auto"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.welcome}
    >
      <Avatar classes={avatarClasses}>
        <Block width="50%">
          <Image alt="Logo" src={avatar} />
        </Block>
      </Avatar>
      <Block marginTop={5} marginBottom={5}>
        <Typography variant="h6">IOV Wallet</Typography>
      </Block>
      <Button classes={buttonClasses} onClick={handleClick}>
        NEXT
      </Button>
    </Block>
  );
};
