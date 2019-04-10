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
  currencyContainer: {
    display: 'flex',
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
      marginTop: '-76px',
    },
  }),

  textField: makeStyles({
    root: {
      outline: '1px solid red',
    },
  }),

  select: makeStyles({
    root: {
      outline: '1px solid red',
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
      <div className={classes.currencyContainer}>
        <TextField label="You send" classes={overrideClasses.textField} />
        <Select classes={overrideClasses.select} />
      </div>
    </Paper>
  );
};

export default CurrencyToSend;
