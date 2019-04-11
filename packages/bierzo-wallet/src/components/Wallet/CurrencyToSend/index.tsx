import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles({
  paperRoot: {
    outline: '1px solid red',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '40px',
  },

  avatarRoot: {
    outline: '1px solid red',
    backgroundColor: '#ffe152',
    width: '72px',
    height: '72px',
    margin: '-76px 0 40px 0',
  },

  sendLabel: {
    outline: '1px solid red',
    color: '#1c1c1c',
  },

  currencyContainer: {
    outline: '1px solid red',
    display: 'flex',
    margin: '40px 0 40px 0',
  },

  textFieldRoot: {
    outline: '1px solid red',
    height: '50px',
    marginRight: '10px',
  },

  selectRoot: {
    outline: '1px solid red',
    height: '30px',
  },

  balanceLabel: {
    outline: '1px solid red',
    color: '#a2a6a8',
  },
});

const CurrencyToSend = ({ positionedClass }: Props) => {
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
      <Avatar classes={avatarClasses} />
      <label className={classes.sendLabel}>You send</label>
      <div className={classes.currencyContainer}>
        <TextField classes={textFieldClasses} />
        <Select classes={selectClasses} />
      </div>
      <label className={classes.balanceLabel}>balance:</label>
    </Paper>
  );
};

export default CurrencyToSend;
