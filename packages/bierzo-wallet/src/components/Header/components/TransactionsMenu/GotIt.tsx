import { makeStyles, Theme } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

interface Props {
  readonly onGotIt: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const GotIt = ({ onGotIt }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root} onClick={onGotIt}>
      <Block margin="md">
        <Typography variant="body1" color="inherit" align="justify">
          To be used as helper throughout the experience
        </Typography>
      </Block>
      <Block margin={2} padding={2}>
        <Typography variant="body1" color="inherit" align="right">
          Got it
        </Typography>
      </Block>
    </div>
  );
};

export default GotIt;
