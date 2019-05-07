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

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    backgroundColor: '#ffe152',
    fontSize: '27.5px',
    width: '72px',
    height: '72px',
    margin: '-76px 0 40px 0',
  },
}));

export const CurrencyToSend = (): JSX.Element => {
  const classes = useStyles();

  const avatarClasses = {
    root: classes.avatar,
  };

  return (
    <Paper>
      <Block display="flex" flexDirection="column" alignItems="center" width="100%" padding={5}>
        <Avatar classes={avatarClasses}>
          <FontAwesomeIcon icon={faUser} color="#ffffff" />
        </Avatar>
        <Typography color="textPrimary" variant="subtitle2">
          You send
        </Typography>
        <Block display="flex" marginTop={5} marginBottom={1}>
          <Block marginRight={1}>
            <TextField placeholder="0,00" />
          </Block>
          <Select />
        </Block>
        <Typography color="error" variant="subtitle2">
          Validity label
        </Typography>
        <Block marginTop={1}>
          <Typography color="textSecondary" variant="subtitle2">
            balance:
          </Typography>
        </Block>
      </Block>
    </Paper>
  );
};
