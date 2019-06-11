import { makeStyles, useTheme, Theme } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import Popper from '@material-ui/core/Popper';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { showPhone } from '../../utils/reactportals';
import { useOpen } from '~/hooks/open';

export interface PhoneHook {
  readonly phoneHook: HTMLDivElement | null;
  readonly phoneMode: boolean;
}

interface Props extends PhoneHook {
  readonly starter: (open: boolean, visited?: boolean) => JSX.Element;
  readonly listWidth: number;
  readonly color?: string;
  readonly onClick?: () => void;
  readonly listId?: string;
  readonly children: React.ReactNode;
}

const useStyles = makeStyles({
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
});

interface ListItemsProps {
  readonly items: React.ReactNode;
  readonly clickAway: () => void;
  readonly style?: React.CSSProperties;
}

const ListItems = ({ items, clickAway, style }: ListItemsProps): JSX.Element => (
  <Grow>
    <ClickAwayListener onClickAway={clickAway} mouseEvent="onClick" touchEvent={false}>
      <React.Fragment>
        <List component="nav" style={style}>
          {items}
        </List>
      </React.Fragment>
    </ClickAwayListener>
  </Grow>
);

const buildListStyleFrom = (phoneMode: boolean, width: number, color: string): React.CSSProperties => {
  const pixels = phoneMode ? 'inherit' : `${width}px`;

  return {
    width: pixels,
    backgroundColor: color,
  };
};

const ListMenu = ({
  listWidth,
  starter,
  children,
  color = 'white',
  phoneHook,
  phoneMode,
  listId,
  onClick,
}: Props): JSX.Element => {
  const menuRef = React.createRef<HTMLDivElement>();
  const theme = useTheme<Theme>();
  const [isOpen, toggle, clickAway] = useOpen();

  const menuClicked = (): void => {
    toggle(onClick);
  };

  const classes = useStyles();
  const style = buildListStyleFrom(phoneMode, listWidth, color);
  const popperStyle = {
    marginTop: theme.spacing(1),
  };

  return (
    <React.Fragment>
      <div id={listId} ref={menuRef} className={classes.root} onClick={menuClicked}>
        {starter(isOpen)}
      </div>
      {showPhone(phoneMode, phoneHook, isOpen) ? (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ReactDOM.createPortal(<ListItems clickAway={clickAway} items={children} style={style} />, phoneHook!)
      ) : (
        <Popper open={isOpen} style={popperStyle} anchorEl={menuRef.current} placement="bottom-end">
          {() => <ListItems clickAway={clickAway} items={children} style={style} />}
        </Popper>
      )}
    </React.Fragment>
  );
};

export default ListMenu;
