import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles(() => ({
  paperRoot: {
    display: 'flex',
    alignItems: 'baseline',
    width: '100%',
    padding: '4rem',
    fontSize: '1.6rem',
  },

  noteIcon: {
    color: '#a2a6a8',
  },

  textFieldRoot: {
    marginLeft: '1.5rem',
  },
}));

export const TextNote = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const paperClasses = {
    root: classes.paperRoot,
  };

  const textFieldClasses = {
    root: classes.textFieldRoot,
  };

  return (
    <Paper className={positionedClass} classes={paperClasses}>
      <FontAwesomeIcon size="lg" icon={faStickyNote} className={classes.noteIcon} />
      <Block width="100%">
        <TextField fullWidth multiline placeholder="Add a note" classes={textFieldClasses} />
      </Block>
    </Paper>
  );
};
