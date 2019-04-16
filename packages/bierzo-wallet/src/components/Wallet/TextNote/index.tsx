import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles(theme => ({
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
    width: '100%',
    height: '5rem',
    marginLeft: '1.5rem',
  },
}));

const TextNote = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const paperClasses = {
    root: classes.paperRoot,
  };

  const textFieldClasses = {
    root: classes.textFieldRoot,
  };

  return (
    <Paper className={positionedClass} classes={paperClasses}>
      <FontAwesomeIcon icon={faStickyNote} className={classes.noteIcon} />
      <TextField multiline={true} placeholder="Add a note" classes={textFieldClasses} />
    </Paper>
  );
};

export default TextNote;
