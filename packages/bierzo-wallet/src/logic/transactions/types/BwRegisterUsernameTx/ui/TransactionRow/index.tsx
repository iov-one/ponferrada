import { RegisterUsernameTx } from "@iov/bns";
import { makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, CircleImage, Hairline, Image, Typography, useOpen } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import toAddress from "../../../../../../routes/transactions/assets/toAddress.svg";
import { getBorderColor } from "../../../../../../theme/css";
import { formatDate, formatTime } from "../../../../../../utils/date";
import { ProcessedTx } from "../../../../types/BwParser";
import dropdownArrow from "../assets/dropdownArrow.svg";
import dropdownArrowClose from "../assets/dropdownArrowClose.svg";
import TxDetails from "./Details";

const useStyles = makeStyles((theme: Theme) => ({
  cell: {
    flex: "1 0 50px",
  },
  txFee: {
    fontSize: "1.2rem",
  },
}));

interface Props {
  readonly tx: ProcessedTx<RegisterUsernameTx>;
}

function TransactionRow({ tx }: Props): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [isOpen, toggle] = useOpen();

  const onClick = (): void => {
    toggle();
  };

  let txFee = "-";
  if (tx.original.fee && tx.original.fee.tokens) {
    txFee = amountToString(tx.original.fee.tokens);
  }

  return (
    <Block display="flex" flexDirection="column" paddingLeft={3} paddingRight={3}>
      <Block margin={2} />
      <Block display="flex" alignItems="center">
        <CircleImage
          icon={toAddress}
          circleColor={theme.palette.background.default}
          borderColor={getBorderColor(theme)}
          alt="Transaction type"
          dia={40}
          width={24}
          height={24}
        />
        <Block className={classes.cell} paddingLeft={2} paddingRight={2}>
          <Typography variant="subtitle2" weight="semibold" gutterBottom>
            Personalized address registration
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="secondary">
            {formatTime(tx.time)}
          </Typography>
        </Block>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" color="secondary" className={classes.cell}>
          {formatDate(tx.time)}
        </Typography>
        <Block flexGrow={1} />
        <Block className={classes.cell}>
          <Typography variant="subtitle2" weight="regular" align="right">
            -
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
      {isOpen && <TxDetails tx={tx} />}
      <Block margin={2} />
      <Hairline />
    </Block>
  );
}

export default TransactionRow;
