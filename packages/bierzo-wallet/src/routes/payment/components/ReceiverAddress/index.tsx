import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  tooltipIcon: {
    color: theme.palette.primary.main,
  },
}));

export const ReceiverAddress = () => {
  const classes = useStyles();

  return (
    <Paper>
      <Block display="flex" flexDirection="column" width="100%" padding={5}>
        <Typography color="textPrimary" variant="subtitle2">
          To
        </Typography>
        <Block width="100%" marginTop={2} marginBottom={1}>
          <TextField placeholder="IOV or wallet address" fullWidth />
        </Block>
        <Typography color="error" variant="subtitle2">
          Validity label
        </Typography>
        <Block display="flex" alignSelf="flex-end" marginTop={3}>
          <Typography color="textPrimary" variant="subtitle1">
            How it works
          </Typography>
          <Block alignSelf="center" marginLeft={1}>
            <FontAwesomeIcon icon={faQuestionCircle} size="lg" className={classes.tooltipIcon} />
          </Block>
        </Block>
      </Block>
    </Paper>
  );
};
