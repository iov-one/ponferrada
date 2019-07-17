import { makeStyles, Theme } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import { ReadonlyDate } from 'readonly-date';

import deleteIcon from '../../../../assets/delete.svg';
import { STATUS_BACKGROUND } from '../../../../theme/css';
import { STATUS_BORDER } from '../../../../theme/css';

const useStyles = makeStyles((theme: Theme) => ({
  deleteIcon: {
    height: theme.spacing(2),
  },
  status: {
    border: `1px solid ${STATUS_BORDER}`,
    borderRadius: theme.spacing(2),
  },
}));

interface Props {
  readonly expiryDate: Date;
}

const StatusPending = ({ expiryDate }: Props): JSX.Element => {
  const classes = useStyles();

  const localeDate = (expiryDate as ReadonlyDate).toLocaleString();

  return (
    <React.Fragment>
      <Block display="flex" alignItems="center" marginBottom={1}>
        <Typography variant="body1" weight="semibold">
          Expires on {localeDate}
        </Typography>
        <Block marginLeft={2}>
          <Block display="flex" alignItems="center">
            <Img src={deleteIcon} alt="Delete Icon" className={classes.deleteIcon} />
            <Typography variant="body1" weight="semibold">
              Delete
            </Typography>
          </Block>
        </Block>
      </Block>
      <Block padding={1} bgcolor={STATUS_BACKGROUND} className={classes.status}>
        <Typography variant="body1">This poll results will be available until {localeDate}</Typography>
      </Block>
    </React.Fragment>
  );
};

export default StatusPending;
