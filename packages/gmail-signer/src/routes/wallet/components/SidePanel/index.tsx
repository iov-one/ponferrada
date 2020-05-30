import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import classNames from "classnames";
import { Block, Hairline, Typography } from "medulas-react-components";
import React, { ReactNode, useState } from "react";

import { RequestContext } from "../../../../context/RequestProvider";
import PanelDrawer, { toolbarHeight } from "./PanelDrawer";

export const panelWidth = 310;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${panelWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: panelWidth,
  },
  drawerIcon: {
    margin: 0,
    padding: 0,
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

interface Props {
  readonly children: ReactNode;
  readonly id?: string;
}

const SidePanel = ({ children, id }: Props): JSX.Element => {
  const requestContext = React.useContext(RequestContext);
  const hasRequests = requestContext.requests.length > 0;

  const [open, setOpen] = useState(hasRequests);
  const openPanel = (): void => setOpen(true);
  const closePanel = (): void => setOpen(false);

  const classes = useStyles();
  const appBarClasses = classNames(classes.appBar, {
    [classes.appBarShift]: open,
  });
  const drawerIconClasses = { root: classes.drawerIcon };
  const contentClasses = classNames(classes.content);

  return (
    <Block minHeight={`calc(100% - ${toolbarHeight}px)`} display="flex" bgcolor="white" id={id}>
      <AppBar position="fixed" color="inherit" className={appBarClasses} elevation={0}>
        <Block
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginTop={4}
          marginBottom={3}
          marginLeft={3}
          marginRight={3}
        >
          <Block minWidth="200px">
            <Typography color="primary" variant="h4" inline>
              Wallet
            </Typography>
            <Typography variant="h4" inline>
              {" Status"}
            </Typography>
          </Block>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="end"
            onClick={openPanel}
            classes={drawerIconClasses}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Block>
        <Block marginRight={3} marginLeft={3}>
          <Hairline />
        </Block>
      </AppBar>
      <Block marginTop={`${toolbarHeight}px`} className={contentClasses}>
        {children}
      </Block>
      <PanelDrawer open={open} closePanel={closePanel} />
    </Block>
  );
};

export default SidePanel;
