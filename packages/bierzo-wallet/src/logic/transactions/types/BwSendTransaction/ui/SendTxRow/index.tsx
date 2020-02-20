import { Address } from "@iov/bcp";
import { makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, CircleImage, Hairline, Image, Typography, useOpen } from "medulas-react-components";
import * as React from "react";
import { amountToString, ellipsifyAddress, sumAmounts } from "ui-logic";

import { getAddressPrefix } from "../../../../../../routes/transactions/components/TxTable/rowTxBuilder";
import { ProcessedSendTransaction } from "../../../../../../store/notifications";
import { getBorderColor } from "../../../../../../theme/css";
import { formatDate } from "../../../../../../utils/date";
import dropdownArrow from "../../../../assets/dropdownArrow.svg";
import dropdownArrowClose from "../../../../assets/dropdownArrowClose.svg";
import txIcon from "../../../../assets/user.svg";
import SendTxDetails from "./Details";

const useStyles = makeStyles((theme: Theme) => ({
  rowToggle: {
    cursor: "pointer",
  },
  cell: {
    flex: "1",
  },
  amountFrom: {
    color: theme.palette.primary.main,
  },
}));

interface Props {
  readonly sendTx: ProcessedSendTransaction;
  readonly userAddresses: readonly Address[];
}

function SendTxRow({ sendTx, userAddresses }: Props): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const amountClass = sendTx.outgoing ? undefined : classes.amountFrom;

  const [isOpen, toggle] = useOpen();

  const address = sendTx.outgoing ? sendTx.original.recipient : sendTx.original.sender;
  const amountSign = sendTx.outgoing ? "-" : "+";

  const amount = sendTx.original.amount;
  const fee = sendTx.outgoing && sendTx.original.fee?.tokens;
  const totalAmount =
    fee && amount.tokenTicker === fee.tokenTicker
      ? amountToString(sumAmounts(amount, fee))
      : amountToString(amount);

  return (
    <Block display="flex" flexDirection="column" paddingLeft={3} paddingRight={3}>
      <Block className={classes.rowToggle} onClick={() => toggle()}>
        <Block padding={2} />
        <Block display="flex" alignItems="center">
          <CircleImage
            icon={txIcon}
            circleColor={theme.palette.background.paper}
            borderColor={getBorderColor(theme)}
            alt="Transaction type"
            dia={40}
            width={24}
            height={24}
          />
          <Block className={classes.cell} paddingLeft={2} paddingRight={2}>
            <Typography variant="subtitle2" weight="semibold">
              {getAddressPrefix(sendTx)} {ellipsifyAddress(address)}
            </Typography>
          </Block>
          <Block flexGrow={1} />
          <Typography variant="subtitle2" weight="regular" color="secondary" className={classes.cell}>
            {formatDate(sendTx.time)}
          </Typography>
          <Block flexGrow={1} />
          <Block className={classes.cell}>
            <Typography variant="subtitle2" weight="regular" align="right" className={amountClass}>
              {`${amountSign}${totalAmount}`}
            </Typography>
          </Block>
          <Block padding={0.5} />
          <Image src={isOpen ? dropdownArrowClose : dropdownArrow} width={16} height={10} alt="Sorting" />
        </Block>
        <Block marginTop={4} />
        <Hairline />
      </Block>
      {isOpen && (
        <React.Fragment>
          <Block marginTop={4} marginBottom={4}>
            <SendTxDetails tx={sendTx} userAddresses={userAddresses} />
          </Block>
          <Hairline />
        </React.Fragment>
      )}
    </Block>
  );
}

export default SendTxRow;
