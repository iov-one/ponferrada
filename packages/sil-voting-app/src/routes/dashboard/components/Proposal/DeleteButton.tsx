import { makeStyles, Theme } from "@material-ui/core";
import Block from "medulas-react-components/lib/components/Block";
import Img from "medulas-react-components/lib/components/Image";
import Typography from "medulas-react-components/lib/components/Typography";
import React from "react";

import deleteIcon from "../../../../assets/delete.svg";

const useStyles = makeStyles((theme: Theme) => ({
  deleteIcon: {
    height: theme.spacing(2),
  },
}));

const DeleteButton = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Block display="flex" alignItems="center">
      <Img src={deleteIcon} alt="Delete Icon" className={classes.deleteIcon} />
      <Typography variant="body2" weight="semibold">
        Delete
      </Typography>
    </Block>
  );
};

export default DeleteButton;
