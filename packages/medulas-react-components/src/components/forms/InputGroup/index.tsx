import { makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";

import { defaultColor } from "../../../theme/utils/variables";
import Block from "../../Block";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  root: {
    border: `1px soli1d ${theme.palette.grey[200]}`,
    borderRadius: 4,
    boxSizing: "border-box",

    "& input": {
      padding: 0,
      paddingLeft: `${theme.spacing(2)}px`,
      fontSize: "2rem",
      color: defaultColor,
      fontWeight: theme.typography.fontWeightLight,
    },
    "& label": {
      display: "none",
    },
    "& fieldset": {
      border: "none",
    },
    "& div[class^='MuiFormControl']": {
      margin: 0,
    },
  },
  prepend: {
    "& .form-select-field": {
      border: "none",
      borderRadius: "unset",
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    "& input": {
      padding: 0,
      textAlign: "left",
    },
  },
}));

interface Props {
  readonly children?: React.ReactNode;
  readonly prepend?: React.ReactNode;
}

const InputGroup = ({ children, prepend }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block className={classes.root} display="flex" alignItems="center">
      {prepend && <Block className={classes.prepend}>{prepend}</Block>}
      {children}
    </Block>
  );
};

export default InputGroup;
