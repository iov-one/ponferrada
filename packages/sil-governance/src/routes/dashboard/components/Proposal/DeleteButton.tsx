import { makeStyles, Theme } from "@material-ui/core";
import { Block, Image, Typography } from "medulas-react-components";
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
      <Image src={deleteIcon} alt="Delete Icon" className={classes.deleteIcon} />
      <Typography variant="body2" weight="semibold">
        Delete
      </Typography>
    </Block>
  );
};

export default DeleteButton;
