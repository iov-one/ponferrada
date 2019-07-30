import { makeStyles, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import { useOpen } from 'medulas-react-components/lib/hooks/open';
import * as React from 'react';

import {
  DEFAULT_ADDRESS,
  getAddressPrefix,
  getTypeIcon,
} from '../../../../../routes/transactions/components/TxTable/rowTxBuilder';
import { ProcessedTx } from '../../../../../store/notifications';
import { getBorderColor } from '../../../../../theme/css';
import { amountToNumber } from '../../../../../utils/balances';
import { getDate, getTime } from '../../../../../utils/date';
import dropdownArrow from '../../../assets/dropdownArrow.svg';
import dropdownArrowClose from '../../../assets/dropdownArrowClose.svg';
import { ParsedTx } from '../../../BwTransaction';
import SendTxDetails from './Details';

export type BwSendTransactionProps = ParsedTx<ProcessedTx>;

const useStyles = makeStyles({
  cell: {
    flex: '1 0 50px',
  },
});

interface Props {
  readonly sendTx: BwSendTransactionProps;
}

function TxTableRow({ sendTx }: Props): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [isOpen, toggle] = useOpen();

  const onClick = (): void => {
    toggle();
  };

  return (
    <Block display="flex" flexDirection="column" paddingLeft={3} paddingRight={3}>
      <Block margin={2} />
      <Block display="flex" alignItems="center">
        <CircleImage
          icon={getTypeIcon(sendTx)}
          circleColor={theme.palette.background.default}
          borderColor={getBorderColor(theme)}
          alt="Transaction type"
          dia={40}
          width={24}
          height={24}
        />
        <Block className={classes.cell} paddingLeft={2} paddingRight={2}>
          <Typography variant="subtitle2" weight="semibold" gutterBottom>
            {getAddressPrefix(sendTx)} {DEFAULT_ADDRESS}
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="secondary">
            {getTime(sendTx.time as Date)}
          </Typography>
        </Block>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" color="secondary" className={classes.cell}>
          {getDate(sendTx.time as Date)}
        </Typography>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" align="right" className={classes.cell}>
          {amountToNumber(sendTx.amount)} {sendTx.amount.tokenTicker}
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
      {isOpen && <SendTxDetails tx={sendTx} />}
      <Block margin={2} />
      <Hairline />
    </Block>
  );
}

export default TxTableRow;
