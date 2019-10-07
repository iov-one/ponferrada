import { Address } from "@iov/bcp";
import { makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FileCopy from "@material-ui/icons/FileCopyOutlined";
import copy from "clipboard-copy";
import { Block, Link, ToastContext, ToastVariant, Typography } from "medulas-react-components";
import * as React from "react";
import { ellipsifyMiddle } from "ui-logic";

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    padding: `0 ${theme.spacing(1)}px`,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

interface TxAddressBlockProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly address: string;
}

const TxAddressBlock = ({ blockExplorerUrl, address, id }: TxAddressBlockProps): JSX.Element => {
  const addressShort = ellipsifyMiddle(address, 18);

  const classes = useStyles();
  const iconButtonClasses = {
    root: classes.icon,
  };
  const toast = React.useContext(ToastContext);

  const onCopyToClipboard = (): void => {
    copy(id);
    toast.show("Transaction id copied to clipboard", ToastVariant.INFO);
  };

  return (
    <React.Fragment>
      <Typography weight="light" inline>
        to:
      </Typography>
      <Block>
        <Typography link={!!blockExplorerUrl} inline>
          {blockExplorerUrl ? <Link to={blockExplorerUrl}>{`${addressShort}`}</Link> : `${addressShort}`}
        </Typography>
        <IconButton
          color="primary"
          disableRipple
          classes={iconButtonClasses}
          aria-label="Copy to clipboard address"
          edge="end"
          onClick={onCopyToClipboard}
        >
          <FileCopy fontSize="small" />
        </IconButton>
      </Block>
    </React.Fragment>
  );
};

interface MsgSendTransactionProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly creator: Address;
  readonly recipient: string;
  readonly amount: string;
}

const MsgSendTransaction = ({
  id,
  blockExplorerUrl,
  error,
  amount,
  recipient,
  creator,
}: MsgSendTransactionProps): JSX.Element => {
  const recipientShort = ellipsifyMiddle(recipient, 18);
  const creatorShort = ellipsifyMiddle(creator, 18);

  if (error) {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          {"Your "}
        </Typography>
        <Typography weight="semibold" inline>
          {amount}
        </Typography>
        <Typography weight="light" inline>
          {" payment to "}
        </Typography>
        <Typography weight="semibold" inline>
          {recipientShort}
        </Typography>
        <Typography weight="light" inline>
          {" from "}
        </Typography>
        <Typography weight="semibold" inline>
          {creatorShort}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          was unsuccessful
        </Typography>
        <Block marginBottom={1.5} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          You ({creatorShort})
        </Typography>
        <Typography weight="semibold" inline>
          {` sent ${amount} `}
        </Typography>
        <TxAddressBlock id={id} blockExplorerUrl={blockExplorerUrl} address={recipient} />
      </React.Fragment>
    );
  }
};

export default MsgSendTransaction;
