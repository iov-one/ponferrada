import { Address } from "@iov/bcp";
import { makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, CircleImage, Hairline, Image, Typography, useOpen } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import {
  DEFAULT_ADDRESS,
  getAddressPrefix,
  getTypeIcon,
} from "../../../../../../routes/transactions/components/TxTable/rowTxBuilder";
import { ProcessedSendTransaction } from "../../../../../../store/notifications";
import { getBorderColor } from "../../../../../../theme/css";
import { formatDate, formatTime } from "../../../../../../utils/date";
import dropdownArrow from "../assets/dropdownArrow.svg";
import dropdownArrowClose from "../assets/dropdownArrowClose.svg";
import SendTxDetails from "./Details";

const useStyles = makeStyles((theme: Theme) => ({
  cell: {
    flex: "1 0 50px",
  },
  txFee: {
    fontSize: "1.2rem",
  },
}));

interface Props {
  readonly sendTx: ProcessedSendTransaction;
  readonly addresses: Address[];
}

function SendTxRow({ sendTx, addresses }: Props): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [isOpen, toggle] = useOpen();

  const onClick = (): void => {
    toggle();
  };

  let txFee = "-";
  if (sendTx.original.fee && sendTx.original.fee.tokens) {
    txFee = amountToString(sendTx.original.fee.tokens);
  }

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
            {formatTime(sendTx.time)}
          </Typography>
        </Block>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" color="secondary" className={classes.cell}>
          {formatDate(sendTx.time)}
        </Typography>
        <Block flexGrow={1} />
        <Block className={classes.cell}>
          <Typography variant="subtitle2" weight="regular" align="right">
            {amountToString(sendTx.original.amount)}
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="secondary"
            align="right"
            className={classes.txFee}
          >
            {txFee}
          </Typography>
        </Block>
        <Block padding={0.5} />
        <Image
          src={isOpen ? dropdownArrowClose : dropdownArrow}
          width={16}
          height={10}
          alt="Sorting"
          onClick={onClick}
        />
      </Block>
      {isOpen && <SendTxDetails tx={sendTx} addresses={addresses} />}
      <Block margin={2} />
      <Hairline />
    </Block>
  );
}

export default SendTxRow;
