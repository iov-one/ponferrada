import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
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
    alignItems: 'center',
    width: '100%',
    padding: '40px',
  },

  avatar: {
    backgroundColor: '#ffe152',
    fontSize: '27.5px',
    width: '72px',
    height: '72px',
    margin: '-76px 0 40px 0',
  },

  avatarIcon: {
    color: '#ffffff',
  },

  sendLabel: {
    fontSize: '14px',
  },

  currencyContainer: {
    display: 'flex',
    margin: '40px 0 8px 0',
  },

  textField: {
    height: '50px',
    marginRight: '10px',
  },

  select: {
    height: '30px',
  },

  validityLabel: {
    fontSize: '14px',
  },

  balanceLabel: {
    fontSize: '14px',
    marginTop: '8px',
  },
}));

export const CurrencyToSend = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const paperClasses = {
    root: classes.paper,
  };

  const avatarClasses = {
    root: classes.avatar,
  };

  const sendLabelClasses = {
    root: classes.sendLabel,
  };

  const textFieldClasses = {
    root: classes.textField,
  };

  const selectClasses = {
    root: classes.select,
  };

  const validityLabelClasses = {
    root: classes.validityLabel,
  };

  const balanceLabelClasses = {
    root: classes.balanceLabel,
  };

  return (
    <Paper className={positionedClass} classes={paperClasses}>
      <Avatar classes={avatarClasses}>
        <FontAwesomeIcon icon={faUser} className={classes.avatarIcon} />
      </Avatar>
      <Typography color="textPrimary" classes={sendLabelClasses}>
        You send
      </Typography>
      <Block className={classes.currencyContainer}>
        <TextField placeholder="0,00" classes={textFieldClasses} />
        <Select classes={selectClasses} />
      </Block>
      <Typography color="error" classes={validityLabelClasses}>
        Validity label
      </Typography>
      <Typography color="textPrimary" classes={balanceLabelClasses}>
        balance:
      </Typography>
    </Paper>
  );
};
