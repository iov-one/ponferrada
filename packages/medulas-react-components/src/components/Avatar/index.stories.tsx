import green from "@material-ui/core/colors/green";
import pink from "@material-ui/core/colors/pink";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentIcon from "@material-ui/icons/Assignment";
import FolderIcon from "@material-ui/icons/Folder";
import PageviewIcon from "@material-ui/icons/Pageview";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Storybook } from "../../utils/storybook";
import Avatar from "../Avatar";
import Block from "../Block";

const useStyles = makeStyles({
  avatar: {
    margin: 10,
  },
  pinkAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: pink[500],
  },
  greenAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: green[500],
  },
});

function IconAvatars(): JSX.Element {
  const classes = useStyles();

  return (
    <Block display="flex" justifyContent="center" alignItems="center" margin={2}>
      <Avatar className={classes.avatar}>
        <FolderIcon />
      </Avatar>
      <Avatar className={classes.pinkAvatar}>
        <PageviewIcon />
      </Avatar>
      <Avatar className={classes.greenAvatar}>
        <AssignmentIcon />
      </Avatar>
    </Block>
  );
}

storiesOf("Components", module).add(
  "Avatars",
  (): JSX.Element => (
    <Storybook>
      <IconAvatars />
    </Storybook>
  ),
);
