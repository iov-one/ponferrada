import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  paperRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '4rem',
  },

  avatarRoot: {
    backgroundColor: '#ffe152',
    fontSize: '2.75rem',
    width: '7.2rem',
    height: '7.2rem',
    margin: '-7.6rem 0 4rem 0',
  },

  avatarIcon: {
    color: '#ffffff',
  },

  sendLabel: {
    color: theme.palette.text.primary,
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.4rem',
  },

  currencyContainer: {
    display: 'flex',
    margin: '4rem 0 .8rem 0',
  },

  textFieldRoot: {
    height: '5rem',
    marginRight: '1rem',
  },

  selectRoot: {
    height: '3rem',
  },

  validityLabel: {
    color: theme.palette.error.main,
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.4rem',
  },

  balanceLabel: {
    color: '#a2a6a8',
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.4rem',
    marginTop: '.8rem',
  },
}));

export const CurrencyToSend = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const paperClasses = {
    root: classes.paperRoot,
  };

  const avatarClasses = {
    root: classes.avatarRoot,
  };

  const textFieldClasses = {
    root: classes.textFieldRoot,
  };

  const selectClasses = {
    root: classes.selectRoot,
  };

  return (
    <Paper className={positionedClass} classes={paperClasses}>
      <Avatar classes={avatarClasses}>
        <FontAwesomeIcon icon={faUser} className={classes.avatarIcon} />
      </Avatar>
      <InputLabel className={classes.sendLabel}>You send</InputLabel>
      <Block className={classes.currencyContainer}>
        <TextField placeholder="0,00" classes={textFieldClasses} />
        <Select classes={selectClasses} />
      </Block>
      <InputLabel className={classes.validityLabel}>Validity label</InputLabel>
      <InputLabel className={classes.balanceLabel}>balance:</InputLabel>
    </Paper>
  );
};
