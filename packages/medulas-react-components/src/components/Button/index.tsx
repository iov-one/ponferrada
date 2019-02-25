import React from 'react';
import { makeStyles } from "@material-ui/styles";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";


const useStyles = makeStyles({
  root: {
    fontFamily: "'Muli', sans-serif",
  },
});

export default function Button({ children }: ButtonProps) {
  //const classes = useStyles();

  return <MuiButton>{children}</MuiButton>;
}
