import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import icon from './assets/iov-logo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  login: {
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

const Login = (): JSX.Element => {
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
      className={classes.login}
    >
      <CircleImage alt="Logo" icon={icon} dia="200px" iconClasses={classes.icon} />
      <Block marginTop={5} marginBottom={5}>
        <Typography variant="h6">IOV Voting Dashboard</Typography>
      </Block>
      <Block display="flex">
        <Button className={classes.button}>LOG IN</Button>
      </Block>
    </Block>
  );
};

export default Login;
