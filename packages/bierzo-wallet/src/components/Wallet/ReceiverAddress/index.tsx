import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles({
  toLabel: {
    outline: '1px solid red',
    alignSelf: 'flex-start',
  },

  validityLabel: {
    outline: '1px solid red',
    alignSelf: 'flex-start',
  },

  tooltipContainer: {
    outline: '1px solid red',
    display: 'flex',
    alignSelf: 'flex-end',
    marginTop: '24px',
  },

  tooltipLabel: {
    outline: '1px solid red',
  },

  tooltipIcon: {
    outline: '1px solid red',
    alignSelf: 'center',
    marginLeft: '10px',
    color: '#31e6c9',
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

  textField: makeStyles({
    root: {
      outline: '1px solid red',
      width: '100%',
      height: '50px',
      margin: '16px 0 8px 0',
    },
  }),
};

const ReceiverAddress = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const overrideClasses = {
    paper: {
      root: muiClasses.paper().root,
    },

    textField: {
      root: muiClasses.textField().root,
    },
  };

  return (
    <Paper className={positionedClass} classes={overrideClasses.paper}>
      <label className={classes.toLabel}>To</label>
      <TextField classes={overrideClasses.textField} />
      <label className={classes.validityLabel}>RequiredText</label>
      <div className={classes.tooltipContainer}>
        <label className={classes.tooltipLabel}>How it works</label>
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className={classes.tooltipIcon}
        />
      </div>
    </Paper>
  );
};

export default ReceiverAddress;
