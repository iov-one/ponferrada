import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import Block from '~/components/layout/Block';
import Typography from '~/components/layout/Typography';

interface Props extends WithStyles<typeof styles> {
  readonly onGotIt: () => void;
}

const styles = createStyles({
  root: {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const GotIt = ({ classes, onGotIt }: Props) => (
  <React.Fragment>
    <Block className={classes.root} padding="md" onClick={onGotIt}>
      <Block margin="md">
        <Typography variant="body1" color="inherit" align="justify">
          To be used as helper throughout the experience
        </Typography>
      </Block>
      <Block align="right" margin="md" padding="md">
        <Typography variant="body1" color="inherit" underlined>
          Got it
        </Typography>
      </Block>
    </Block>
  </React.Fragment>
);

export default withStyles(styles)(GotIt);
