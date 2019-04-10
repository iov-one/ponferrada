import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles({
  noteIcon: {
    outline: '1px solid red',
  },
});

const muiClasses = {
  paper: makeStyles({
    root: {
      outline: '1px solid red',
      display: 'flex',
      alignItems: 'baseline',
      width: '100%',
      padding: '40px',
    },
  }),

  textField: makeStyles({
    root: {
      outline: '1px solid red',
      width: '100%',
      height: '50px',
      marginLeft: '15px',
    },
  }),
};

const TextNote = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const overrideClasses = {
    paper: {
      root: muiClasses.paper().root,
    },

    textField: {
      root: muiClasses.textField().root,
    },
  };

  return (
    <Paper className={positionedClass} classes={overrideClasses.paper}>
      <FontAwesomeIcon icon={faStickyNote} className={classes.noteIcon} />
      <TextField label="Add a note" classes={overrideClasses.textField} />
    </Paper>
  );
};

export default TextNote;
