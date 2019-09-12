import { makeStyles, Theme } from "@material-ui/core";
import List from "@material-ui/core/List";
import Popover, { PopoverOrigin } from "@material-ui/core/Popover";
import * as React from "react";

import { useOpen } from "../../hooks/open";

interface Props {
  readonly starter: (open: boolean, visited?: boolean) => JSX.Element;
  readonly listWidth: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly onClick?: () => void;
  readonly listId?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "pointer",
    },
    "& > div": {
      display: "flex",
    },
  },
  list: ({ listWidth, color }: Pick<Props, "listWidth" | "color">) => ({
    width: `${listWidth}px`,
    backgroundColor: color,
  }),
  popper: {
    marginTop: theme.spacing(1),
  },
}));

const anchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

const transformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "right",
};

const ListMenu = ({ listWidth, starter, children, color = "white", listId, onClick }: Props): JSX.Element => {
  const menuRef = React.useRef(null);
  const [isOpen, toggle, clickAway] = useOpen();

  const menuClicked = (): void => {
    toggle(onClick);
  };

  const classes = useStyles({ listWidth, color });

  return (
    <React.Fragment>
      <div id={listId} ref={menuRef} className={classes.root} onClick={menuClicked}>
        {starter(isOpen)}
      </div>
      <Popover
        open={isOpen}
        className={classes.popper}
        anchorEl={menuRef.current}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        onClose={clickAway}
      >
        <List component="nav" className={classes.list}>
          {children}
        </List>
      </Popover>
    </React.Fragment>
  );
};

export default ListMenu;
