import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '40px',
  },

  textField: {
    width: '100%',
    height: '50px',
    margin: '16px 0 8px 0',
  },

  tooltipContainer: {
    display: 'flex',
    alignSelf: 'flex-end',
    fontSize: '14px',
    marginTop: '24px',
  },

  tooltipIcon: {
    alignSelf: 'center',
    marginLeft: '10px',
    color: theme.palette.primary.main,
  },
}));

export const ReceiverAddress = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const paperClasses = {
    root: classes.paper,
  };

  const textFieldClasses = {
    root: classes.textField,
  };

  return (
    <Paper className={positionedClass} classes={paperClasses}>
      <Typography color="textPrimary" variant="subtitle2">
        To
      </Typography>
      <TextField placeholder="IOV or wallet address" classes={textFieldClasses} />
      <Typography color="error" variant="subtitle2">
        Validity label
      </Typography>
      <Block className={classes.tooltipContainer}>
        <Typography color="textPrimary">How it works</Typography>
        <FontAwesomeIcon icon={faQuestionCircle} className={classes.tooltipIcon} />
      </Block>
    </Paper>
  );
};
