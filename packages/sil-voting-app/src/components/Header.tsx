import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import icon from '../assets/iov-logo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    '& > div + h5': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Header = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Block width="100%" minHeight="78px" display="flex" alignItems="center">
      <Block width="20%" display="flex" alignItems="center" justifyContent="center" className={classes.logo}>
        <CircleImage alt="Logo" icon={icon} dia="48px" circleColor="#fff" />
        <Typography variant="h5">IOV</Typography>
      </Block>
      <Block width="80%">
        <Typography variant="h5">Voting Dashboard</Typography>
      </Block>
    </Block>
  );
};

export default Header;
