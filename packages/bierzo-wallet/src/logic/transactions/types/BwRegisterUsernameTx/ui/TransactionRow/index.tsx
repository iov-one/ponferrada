import { RegisterUsernameTx } from "@iov/bns";
import { makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, CircleImage, Hairline, Image, Typography, useOpen } from "medulas-react-components";
import * as React from "react";

import toAddress from "../../../../../../routes/transactions/assets/toAddress.svg";
import { DEFAULT_ADDRESS } from "../../../../../../routes/transactions/components/TxTable/rowTxBuilder";
import { getBorderColor } from "../../../../../../theme/css";
import { formatDate, formatTime } from "../../../../../../utils/date";
import { ProcessedTx } from "../../../../types/BwParser";
import dropdownArrow from "../assets/dropdownArrow.svg";
import dropdownArrowClose from "../assets/dropdownArrowClose.svg";
import SendTxDetails from "./Details";

const useStyles = makeStyles({
  cell: {
    flex: "1 0 50px",
  },
});

interface Props {
  readonly sendTx: ProcessedTx<RegisterUsernameTx>;
}

function TransactionRow({ sendTx }: Props): JSX.Element {
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
            {formatTime(sendTx.time)}
          </Typography>
        </Block>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" color="secondary" className={classes.cell}>
          {formatDate(sendTx.time)}
        </Typography>
        <Block flexGrow={1} />
        <Typography variant="subtitle2" weight="regular" align="right" className={classes.cell}>
          -
        </Typography>
        <Block padding={0.5} />
        <Image
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

export default TransactionRow;
