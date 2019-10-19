import { makeStyles } from "@material-ui/styles";
import { Block, Typography } from "medulas-react-components";
import React from "react";
import { ReadonlyDate } from "readonly-date";

export const blockchainTimeHtmlId = "blockchain-time";

interface Props {
  readonly lastBlockHeight: number;
  readonly lastBlockTime: ReadonlyDate;
}

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
});

const BlockchainTime = ({ lastBlockHeight, lastBlockTime }: Props): JSX.Element => {
  const classes = useStyles();
  const datetime = lastBlockTime.toLocaleString();
  return (
    <Block id={blockchainTimeHtmlId} className={classes.container} padding={1}>
      <Typography variant="body1">Blockchain time</Typography>
      <Typography variant="body2">
        {datetime} (Height&nbsp;{lastBlockHeight})
      </Typography>
    </Block>
  );
};

export default BlockchainTime;
