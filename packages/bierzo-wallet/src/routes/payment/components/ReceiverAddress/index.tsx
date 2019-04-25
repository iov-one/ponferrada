import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
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
    width: '100%',
    padding: '4rem',
  },

  toLabel: {
    color: theme.palette.text.primary,
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.4rem',
  },

  textFieldRoot: {
    width: '100%',
    height: '5rem',
    margin: '1.6rem 0 .8rem 0',
  },

  validityLabel: {
    color: theme.palette.error.main,
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.4rem',
  },

  tooltipContainer: {
    display: 'flex',
    alignSelf: 'flex-end',
    fontSize: '1.4rem',
    marginTop: '2.4rem',
  },

  tooltipLabel: {
    color: theme.palette.text.primary,
  },

  tooltipIcon: {
    alignSelf: 'center',
    marginLeft: '1rem',
    color: theme.palette.primary.main,
  },
}));

export const ReceiverAddress = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const paperClasses = {
    root: classes.paperRoot,
  };

  const textFieldClasses = {
    root: classes.textFieldRoot,
  };

  return (
    <Paper className={positionedClass} classes={paperClasses}>
      <InputLabel className={classes.toLabel}>To</InputLabel>
      <TextField placeholder="IOV or wallet address" classes={textFieldClasses} />
      <InputLabel className={classes.validityLabel}>Validity label</InputLabel>
      <Block className={classes.tooltipContainer}>
        <InputLabel className={classes.tooltipLabel}>How it works</InputLabel>
        <FontAwesomeIcon icon={faQuestionCircle} className={classes.tooltipIcon} />
      </Block>
    </Paper>
  );
};
