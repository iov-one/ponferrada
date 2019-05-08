import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import icon from '../../assets/iov-logo.svg';
import { history } from '../../store/reducers';
import { PAYMENT_ROUTE } from '../paths';
import { ExtensionInteraction } from './components/ExtensionInteraction';

const useStyles = makeStyles((theme: Theme) => ({
  welcome: {
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
    padding: '50px',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const handleClick = (): void => {
  history.push(PAYMENT_ROUTE);
};

const Welcome = (): JSX.Element => {
  const classes = useStyles();

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
      <CircleImage alt="Logo" icon={icon} dia="200px" iconClasses={classes.icon} />
      <Block marginTop={5} marginBottom={5}>
        <Typography variant="h6">IOV Wallet</Typography>
      </Block>
      <Block display="flex">
        <Button className={classes.button} onClick={handleClick}>
          SEND PAYMENT
        </Button>
      </Block>
      <ExtensionInteraction />
    </Block>
  );
};

export default Welcome;
