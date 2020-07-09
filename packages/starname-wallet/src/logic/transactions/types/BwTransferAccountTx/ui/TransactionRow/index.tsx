import { TransferAccountTx } from "@iov/bns";
import { makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, CircleImage, Hairline, Image, Typography, useOpen } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import { getBorderColor } from "../../../../../../theme/css";
import { formatDate } from "../../../../../../utils/date";
import dropdownArrow from "../../../../assets/dropdownArrow.svg";
import dropdownArrowClose from "../../../../assets/dropdownArrowClose.svg";
import txIcon from "../../../../assets/user.svg";
import { ProcessedTx } from "../../../BwParser";
import TxDetails from "./Details";

const useStyles = makeStyles({
  rowToggle: {
    cursor: "pointer",
  },
  cell: {
    flex: "1",
  },
});

interface Props {
  readonly tx: ProcessedTx<TransferAccountTx>;
}

function TransactionRow({ tx }: Props): React.ReactElement {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [isOpen, toggle] = useOpen();

  let txFee = "-";
  if (tx.original.fee && tx.original.fee.tokens) {
    txFee = amountToString(tx.original.fee.tokens);
  }

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
              Account transfer
            </Typography>
          </Block>
          <Block flexGrow={1} />
          <Typography variant="subtitle2" weight="regular" color="secondary" className={classes.cell}>
            {formatDate(tx.time)}
          </Typography>
          <Block flexGrow={1} />
          <Block className={classes.cell}>
            <Typography variant="subtitle2" weight="regular" align="right">
              -{txFee}
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
            <TxDetails tx={tx} />
          </Block>
          <Hairline />
        </React.Fragment>
      )}
    </Block>
  );
}

export default TransactionRow;
