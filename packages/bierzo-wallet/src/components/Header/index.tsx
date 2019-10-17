import { makeStyles } from "@material-ui/core";
import { Block, Image } from "medulas-react-components";
import * as React from "react";

import logoBlack from "./assets/logoBlack.svg";
import HiMenu from "./components/HiMenu";
import LinksMenu from "./components/LinksMenu";

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    minHeight: "70px",
    backgroundColor: "white",
  },
});

interface Props {
  path: string;
}

const Header = ({ path }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block className={classes.root} padding={3} paddingBottom={2}>
      <Image src={logoBlack} alt="Logo" />
      <Block flexGrow={1} />
      <LinksMenu path={path} />
      <Block flexGrow={4} />
      <HiMenu />
    </Block>
  );
};

export default Header;
