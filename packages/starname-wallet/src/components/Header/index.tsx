import { makeStyles } from "@material-ui/core";
import { Block, Image } from "medulas-react-components";
import * as React from "react";
import { useSelector } from "react-redux";

import { lastTxSelector } from "../../store/notifications/selectors";
import neumaLogo from "./assets/neumaWalletLogo.svg";
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

const Header = ({ path }: Props): React.ReactElement => {
  const classes = useStyles();
  const lastTx = useSelector(lastTxSelector);

  return (
    <Block className={classes.root} padding={3} paddingBottom={2}>
      <Image src={neumaLogo} alt="Logo" />
      <Block flexGrow={1} />
      <LinksMenu path={path} lastTx={lastTx} />
      <Block flexGrow={4} />
      <HiMenu />
    </Block>
  );
};

export default Header;
