import { makeStyles, Theme } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import Popper from '@material-ui/core/Popper';
import * as React from 'react';
import { useOpen } from '~/hooks/open';

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
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
    '& > div': {
      display: 'flex',
    },
  },
  list: ({ listWidth, color }: Pick<Props, 'listWidth' | 'color'>) => ({
    width: `${listWidth}px`,
    backgroundColor: color,
  }),
  popper: {
    marginTop: theme.spacing(1),
  },
}));

const ListMenu = ({ listWidth, starter, children, color = 'white', listId, onClick }: Props): JSX.Element => {
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
      <Popper open={isOpen} className={classes.popper} anchorEl={menuRef.current} placement="bottom-end">
        <Grow>
          <ClickAwayListener onClickAway={clickAway} mouseEvent="onClick" touchEvent={false}>
            <List component="nav" className={classes.list}>
              {children}
            </List>
          </ClickAwayListener>
        </Grow>
      </Popper>
    </React.Fragment>
  );
};

export default ListMenu;
