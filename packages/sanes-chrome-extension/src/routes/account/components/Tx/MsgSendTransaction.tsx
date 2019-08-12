import { makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FileCopy from "@material-ui/icons/FileCopyOutlined";
import copy from "clipboard-copy";
import { Block, Link, ToastContext, ToastVariant, Typography } from "medulas-react-components";
import * as React from "react";

import { ellipsify } from "../../../../utils/strings";

interface MsgSendTransactionProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly recipient: string;
  readonly amount: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    padding: `0 ${theme.spacing(1)}px`,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

const MsgSendTransaction = ({
  id,
  blockExplorerUrl,
  error,
  amount,
  recipient,
}: MsgSendTransactionProps): JSX.Element => {
  const classes = useStyles();
  const toast = React.useContext(ToastContext);

  const recipientShort = ellipsify(recipient, 18);
  const iconButtonClasses = {
    root: classes.icon,
  };
  const onCopyToClipboard = (): void => {
    copy(id);
    toast.show("Transaction id copied to clipboard", ToastVariant.INFO);
  };

  if (error) {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          {"Your "}
        </Typography>
        <Typography weight="semibold" inline>
          {amount}
        </Typography>
        <Typography weight="semibold" inline>
          {" payment to "}
        </Typography>
        <Typography weight="semibold" inline link>
          {recipientShort}
        </Typography>
        <Typography weight="light" inline>
          {" was "}
        </Typography>
        <Typography weight="semibold" inline>
          {"unsuccessful"}
        </Typography>
        <Typography weight="light" inline>
          {", please try again later"}
        </Typography>
        <Block marginBottom={1.5} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          You
        </Typography>
        <Typography weight="semibold" inline>
          {` sent ${amount} `}
        </Typography>
        <Typography weight="light" inline>
          {"to:"}
        </Typography>
        <Block marginBottom={1.5}>
          <Typography link={!!blockExplorerUrl} inline>
            {blockExplorerUrl ? (
              <Link to={blockExplorerUrl}>{`${recipientShort}`}</Link>
            ) : (
              `${recipientShort}`
            )}
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
  }
};

export default MsgSendTransaction;
