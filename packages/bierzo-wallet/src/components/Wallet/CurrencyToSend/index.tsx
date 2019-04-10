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
  sendLabel: {
    outline: '1px solid red',
    color: '#1c1c1c',
  },

  currencyContainer: {
    outline: '1px solid red',
    display: 'flex',
    margin: '40px 0 40px 0',
  },

  balanceLabel: {
    outline: '1px solid red',
    color: '#a2a6a8',
  },
});

const muiClasses = {
  paper: makeStyles({
    root: {
      outline: '1px solid red',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      padding: '40px',
    },
  }),

  avatar: makeStyles({
    root: {
      outline: '1px solid red',
      backgroundColor: '#ffe152',
      width: '72px',
      height: '72px',
      margin: '-76px 0 40px 0',
    },
  }),

  textField: makeStyles({
    root: {
      outline: '1px solid red',
      height: '50px',
      marginRight: '10px',
    },
  }),

  select: makeStyles({
    root: {
      outline: '1px solid red',
      height: '30px',
    },
  }),
};

const CurrencyToSend = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const overrideClasses = {
    paper: {
      root: muiClasses.paper().root,
    },

    avatar: {
      root: muiClasses.avatar().root,
    },

    textField: {
      root: muiClasses.textField().root,
    },

    select: {
      root: muiClasses.select().root,
    },
  };

  return (
    <Paper className={positionedClass} classes={overrideClasses.paper}>
      <Avatar classes={overrideClasses.avatar} />
      <label className={classes.sendLabel}>You send</label>
      <div className={classes.currencyContainer}>
        <TextField classes={overrideClasses.textField} />
        <Select classes={overrideClasses.select} />
      </div>
      <label className={classes.balanceLabel}>balance:</label>
    </Paper>
  );
};

export default CurrencyToSend;
