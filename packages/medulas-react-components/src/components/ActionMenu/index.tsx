import { makeStyles } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { PopoverOrigin } from "@material-ui/core/Popover";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import * as React from "react";

import Block from "../Block";
import Typography from "../Typography";

export interface ActionMenuItem {
  readonly title: string;
  readonly action: () => void;
}

const useMenuStyles = makeStyles({
  paper: {
    border: "none",
    boxShadow: "0px 0px 14px #EDEFF4",
  },
  list: {
    border: "none",
  },
});

const anchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "center",
};

const transformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "center",
};

interface Props {
  readonly menuItems: readonly ActionMenuItem[];
}

const ActionMenu: React.FunctionComponent<Props> = ({ menuItems }) => {
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLAnchorElement) | null>(null);
  const menuClasses = useMenuStyles();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Link onClick={handleClick}>
        <MoreHorizIcon fontSize="large" />
      </Link>
      <Menu
        classes={menuClasses}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map(item => (
          <MenuItem key={item.title} onClick={item.action}>
            <ListItemText
              disableTypography
              primary={
                <Block marginRight={4}>
                  <Typography>{item.title}</Typography>
                </Block>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default ActionMenu;
