import { makeStyles } from "@material-ui/core";
import Block from "medulas-react-components/lib/components/Block";
import Typography from "medulas-react-components/lib/components/Typography";
import * as React from "react";

import { ProcessedSendTransaction } from "../../../../../../store/notifications";

const useStyles = makeStyles({
  sectionName: {
    overflowWrap: "break-word",
  },
});

interface Props {
  readonly tx: ProcessedSendTransaction;
}

const TxDetails = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block margin={2} />
      <Block display="flex">
        <Block width="50%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Sender:
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="textSecondary"
            className={classes.sectionName}
          >
            {tx.original.sender}
          </Typography>
          <Typography>&nbsp;</Typography>
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Recipient:
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="textSecondary"
            className={classes.sectionName}
          >
            {tx.original.recipient}
          </Typography>
        </Block>
        <Block width="50%">
          <Block>
            <Typography variant="subtitle2" weight="regular" gutterBottom>
              Note:
            </Typography>
            <Typography variant="subtitle2" weight="regular" color="textSecondary">
              {tx.original.memo || "No note"}
            </Typography>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default TxDetails;
