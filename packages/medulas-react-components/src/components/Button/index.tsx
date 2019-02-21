import React from 'react';
import { makeStyles } from "@material-ui/styles";
import MuiButton from "@material-ui/core/Button";


const useStyles = makeStyles({
    root: {},
  });

  export default function Button() {
    const classes = useStyles();
    return <MuiButton className={classes.root}>Hook</MuiButton>;
  }
