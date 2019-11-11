import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { Block, Image, makeStyles, Typography } from "medulas-react-components";
import React, { useState } from "react";

import { panelWidth } from "..";
import chevronLeft from "../../../assets/chevronLeft.svg";
import chevronRight from "../../../assets/chevronRight.svg";
import closeButton from "../../../assets/closeButton.svg";
import neumaLogo from "../../../assets/NeumaLogo.svg";
import About from "./About";
import DeleteWallet from "./DeleteWallet";
import Menu from "./Menu";
import Networks from "./Networks";
import RecoveryWords from "./RecoveryWords";
import Requests from "./Requests";
import Settings from "./Settings";

export const drawerHtmlId = "wallet-sidepanel";
export const toolbarHeight = 102;
const logoWidth = 100;

export enum Views {
  Menu = "Menu",
  Requests = "Requests",
  Settings = "Settings",
  Networks = "Networks",
  About = "About",
  RecoveryWords = "Recovery Words",
  DeleteWallet = "Delete Wallet",
}

const viewComponents = {
  [Views.Menu]: Menu,
  [Views.Requests]: Requests,
  [Views.Settings]: Settings,
  [Views.Networks]: Networks,
  [Views.About]: About,
  [Views.RecoveryWords]: RecoveryWords,
  [Views.DeleteWallet]: DeleteWallet,
};

const previousViews = {
  [Views.Menu]: Views.Menu,
  [Views.Requests]: Views.Menu,
  [Views.Settings]: Views.Menu,
  [Views.Networks]: Views.Settings,
  [Views.About]: Views.Settings,
  [Views.RecoveryWords]: Views.Settings,
  [Views.DeleteWallet]: Views.Settings,
};

const useStyles = makeStyles({
  drawer: {
    width: panelWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: panelWidth,
  },
  drawerIcon: {
    margin: 0,
    padding: 0,
  },
  chevronButton: {
    height: "20px",
  },
  closeButton: {
    height: "18px",
  },
});

interface Props {
  readonly open: boolean;
  readonly closePanel: () => void;
}

const PanelDrawer = ({ open, closePanel }: Props): JSX.Element => {
  const classes = useStyles();
  const drawerClasses = { paper: classes.drawerPaper };

  const [viewTitle, setViewTitle] = useState(Views.Menu);

  const ViewComponent = viewComponents[viewTitle];

  const goBack = (): void => {
    const previousView = previousViews[viewTitle];
    setViewTitle(previousView);
  };

  const resetPanelAndClose = (): void => {
    setViewTitle(Views.Menu);
    closePanel();
  };

  const canGoBack = viewTitle !== Views.Menu;

  return (
    <Drawer className={classes.drawer} variant="temporary" anchor="right" open={open} classes={drawerClasses}>
      <Block id={drawerHtmlId} width={panelWidth} height={`calc(100% - ${toolbarHeight}px)`}>
        <Block
          height={toolbarHeight}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginLeft={3}
          marginRight={3}
        >
          <Block display="flex" alignItems="center">
            {canGoBack && (
              <IconButton className={classes.drawerIcon} onClick={goBack}>
                <Image alt="Back Button" src={chevronLeft} className={classes.chevronButton} />
              </IconButton>
            )}
            {!canGoBack && (
              <Image alt="Chevron Button" src={chevronRight} className={classes.chevronButton} />
            )}
            <Block marginLeft={2}>
              <Typography variant="h5">{viewTitle}</Typography>
            </Block>
          </Block>
          <IconButton className={classes.drawerIcon} onClick={resetPanelAndClose}>
            <Image alt="Close Button" src={closeButton} className={classes.closeButton} />
          </IconButton>
        </Block>
        <Block
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <ViewComponent updateCurrentView={setViewTitle} />
          <Block marginBottom={2} marginTop={2} justifyContent="flex-end" textAlign="center">
            <Image src={neumaLogo} alt="Logo" width={logoWidth} />
          </Block>
        </Block>
      </Block>
    </Drawer>
  );
};

export default PanelDrawer;