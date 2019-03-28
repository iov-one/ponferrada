import { Popper, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import Image from '../Image';
import infoNormal from './assets/info_normal.svg';
import theme from '../../theme/utils/mui';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(2)} 0 #e3e4e7`,
  },
}));

interface Props {
  readonly children: React.ReactNode;
  readonly maxWidth?: number;
}

const DEFAULT_HEIGHT = 16;
let tooltipRef = React.createRef<HTMLDivElement>();

const Tooltip = ({ children, maxWidth = 200 }: Props): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const toggle = (): void => setOpen(!open);

  const classes = useStyles();

  const popperStyle = {
    marginTop: theme.spacing(1),
    maxWidth,
  };

  const popperModifiers = {
    flip: {
      enabled: true,
    },
  };

  const divStyle = {
    height: `${DEFAULT_HEIGHT}px`,
    display: 'inline',
  };

  return (
    <React.Fragment>
      <div style={divStyle} ref={tooltipRef} onClick={toggle}>
        <Image
          src={infoNormal}
          alt="Info"
          width={DEFAULT_HEIGHT}
          height={DEFAULT_HEIGHT}
        />
      </div>
      <Popper
        open={open}
        style={popperStyle}
        anchorEl={tooltipRef.current}
        placement="bottom-end"
        modifiers={popperModifiers}
      >
        <Paper className={classes.paper}>{children}</Paper>
      </Popper>
    </React.Fragment>
  );
};

export default Tooltip;
