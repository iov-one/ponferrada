import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';
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

  toLabel: {
    outline: '1px solid red',
    alignSelf: 'flex-start',
  },

  textFieldRoot: {
    outline: '1px solid red',
    width: '100%',
    height: '50px',
    margin: '16px 0 8px 0',
  },

  validityLabel: {
    outline: '1px solid red',
    alignSelf: 'flex-start',
  },

  tooltipContainer: {
    outline: '1px solid red',
    display: 'flex',
    alignSelf: 'flex-end',
    fontSize: '16px',
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

const ReceiverAddress = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const paperClasses = {
    root: classes.paperRoot,
  };

  const textFieldClasses = {
    root: classes.textFieldRoot,
  };

  return (
    <Paper className={positionedClass} classes={paperClasses}>
      <label className={classes.toLabel}>To</label>
      <TextField
        placeholder="IOV or wallet address"
        variant="outlined"
        classes={textFieldClasses}
      />
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
