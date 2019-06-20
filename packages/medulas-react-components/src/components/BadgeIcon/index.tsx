import { Badge, makeStyles, PropTypes, Theme } from '@material-ui/core';
import React from 'react';
import Img from '../Image';
import CheckIcon from './assets/check.svg';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly icon: string;
  readonly badge: 'dot' | 'check';
  readonly invisible: boolean;
  readonly color?: PropTypes.Color | 'error';
}

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    backgroundColor: '#d6faf4',
    height: theme.spacing(6),
    width: theme.spacing(6),
    borderRadius: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: '29px',
    top: '-8px',
    right: '-8px',
  },
  dot: {
    width: '7px',
    height: '7px',
    top: '-7px',
    right: '-7px',
  },
}));

const BadgeIcon = ({ icon, badge, invisible, color = 'primary', ...rest }: Props): JSX.Element => {
  const classes = useStyles();

  const badgeClasses = { badge: badge === 'check' ? classes.check : classes.dot };
  const badgeContent = badge === 'check' ? <Img src={CheckIcon} alt="Badge Icon" /> : '';
  const content =
    badge === 'check' ? (
      <div className={classes.background}>
        <Img src={icon} alt="Icon" {...rest} />
      </div>
    ) : (
      <Img src={icon} alt="Icon" {...rest} />
    );

  return (
    <Badge badgeContent={badgeContent} classes={badgeClasses} invisible={invisible} color={color}>
      {content}
    </Badge>
  );
};

export default BadgeIcon;
