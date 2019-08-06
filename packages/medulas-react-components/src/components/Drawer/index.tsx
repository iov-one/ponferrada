import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import classNames from "classnames";
import React from "react";

import Block from "../Block";
import Image from "../Image";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    backgroundColor: "white",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hidden: {
    opacity: 0,
  },
  show: {
    transition: theme.transitions.create("opacity", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen * 3,
    }),
    opacity: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    minHeight: "100vh",
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

interface DrawerItems {
  readonly icon?: string;
  readonly text: string;
  readonly action: () => void;
}

interface Props {
  readonly children: React.ReactNode;
  readonly items: readonly DrawerItems[];
  readonly footer?: React.ReactNode;
  readonly elevation?: number;
}

export const DRAWER_HTML_ID = "account-drawer";

function PersistentDrawerRight({ children, items, footer, elevation = 0 }: Props): JSX.Element {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  function handleDrawerOpen(): void {
    setOpen(true);
  }

  function handleDrawerClose(): void {
    setOpen(false);
  }

  const appBarClasses = classNames(classes.appBar, {
    [classes.appBarShift]: open,
  });
  const drawerIconClasses = classNames(classes.hidden, !open && classes.show);
  const contentClasses = classNames(classes.content);
  const drawerClasses = {
    paper: classes.drawerPaper,
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="inherit" className={appBarClasses} elevation={elevation}>
        <Toolbar>
          <Block flexGrow={1} />
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={drawerIconClasses}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={contentClasses}>
        <div className={classes.drawerHeader} />
        <div>{children}</div>
      </main>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor="right"
        open={open}
        classes={drawerClasses}
      >
        <div id={DRAWER_HTML_ID}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <List component="nav">
            {items.map(item => (
              <ListItem button key={item.text}>
                {item.icon && (
                  <ListItemIcon>
                    <Image src={item.icon} alt="Menu icon" />
                  </ListItemIcon>
                )}
                <ListItemText primary={item.text} onClick={item.action} />
              </ListItem>
            ))}
          </List>
          {footer && <footer>{footer}</footer>}
        </div>
      </Drawer>
    </div>
  );
}

export default PersistentDrawerRight;
