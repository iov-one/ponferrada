import { makeStyles, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import { useOpen } from 'medulas-react-components/lib/hooks/open';
import * as React from 'react';

import { getBorderColor } from '../../../../../theme/css';
import { amountToNumber } from '../../../../../utils/balances';
import { getDate, getTime } from '../../../../../utils/date';
import dropdownArrow from '../../../assets/dropdownArrow.svg';
import dropdownArrowClose from '../../../assets/dropdownArrowClose.svg';
import { DEFAULT_ADDRESS, getAddressPrefix, getTypeIcon, TxTableRowProps } from '../rowTxBuilder';
import TxDetails from '../TxDetails';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    flexDirection: 'column',
  },
  rowContent: {
    display: 'flex',
    alignItems: 'center',
  },
  cell: {
    flex: '1 0 50px',
  },
});

function TxTableRow({ tx }: TxTableRowProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [isOpen, toggle] = useOpen();

  const onClick = (): void => {
    toggle();
  };

  return (
    <Block paddingLeft={3} paddingRight={3} className={classes.row}>
      <Block margin={2} />
      <Block className={classes.rowContent}>
        <CircleImage
          icon={getTypeIcon(tx)}
          circleColor={theme.palette.background.default}
          borderColor={getBorderColor(theme)}
          alt="Transaction type"
          dia={40}
          width={24}
          height={24}
        />
        <Block className={classes.cell} paddingLeft={2} paddingRight={2}>
          <Typography variant="subtitle2" weight="semibold" gutterBottom>
            {getAddressPrefix(tx)} {DEFAULT_ADDRESS}
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="secondary">
            {getTime(tx.time as Date)}
          </Typography>
        </Block>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" color="secondary" className={classes.cell}>
          {getDate(tx.time as Date)}
        </Typography>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" align="right" className={classes.cell}>
          {amountToNumber(tx.amount)} {tx.amount.tokenTicker}
        </Typography>
        <Block padding={0.5} />
        <Img
          src={isOpen ? dropdownArrowClose : dropdownArrow}
          width={16}
          height={10}
          alt="Sorting"
          onClick={onClick}
        />
      </Block>
      {isOpen && <TxDetails tx={tx} />}
      <Block margin={2} />
      <Hairline />
    </Block>
  );
}

export default TxTableRow;
