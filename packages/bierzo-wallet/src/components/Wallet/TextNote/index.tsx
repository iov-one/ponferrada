import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
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
    alignItems: 'baseline',
    width: '100%',
    padding: '40px',
    fontSize: '16px',
  },

  noteIcon: {
    outline: '1px solid red',
    color: '#a2a6a8',
  },

  textFieldRoot: {
    outline: '1px solid red',
    width: '100%',
    height: '50px',
    marginLeft: '15px',
  },
});

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
      <TextField
        multiline={true}
        placeholder="Add a note"
        variant="outlined"
        classes={textFieldClasses}
      />
    </Paper>
  );
};

export default TextNote;
