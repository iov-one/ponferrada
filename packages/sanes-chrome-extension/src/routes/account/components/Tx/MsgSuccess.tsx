import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FileCopy from '@material-ui/icons/FileCopyOutlined';
import copy from 'clipboard-copy';
import Block from 'medulas-react-components/lib/components/Block';
import Link from 'medulas-react-components/lib/components/Link';
import Typography from 'medulas-react-components/lib/components/Typography';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import * as React from 'react';
import { elipsify } from '../../../../utils/strings';

interface MsgProps {
  readonly recipient: string;
  readonly amount: string;
  readonly blockExplorerUrl: string | null;
  readonly id: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    padding: `0 ${theme.spacing(1)}px`,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

const Msg = ({ id, amount, blockExplorerUrl, recipient }: MsgProps): JSX.Element => {
  const classes = useStyles();
  const toast = React.useContext(ToastContext);

  const recipientShort = elipsify(recipient, 18);
  const iconButtonClasses = {
    root: classes.icon,
  };
  const onCopyToClipboard = (): void => {
    copy(id);
    toast.show('Transaction id copied to clipboard', ToastVariant.INFO);
  };

  return (
    <React.Fragment>
      <Typography weight="light" inline>
        You
      </Typography>
      <Typography weight="semibold" inline>
        {` sent ${amount} `}
      </Typography>
      <Typography weight="light" inline>
        {'to:'}
      </Typography>
      <Block marginBottom={1.5}>
        <Typography link={!!blockExplorerUrl} inline>
          {blockExplorerUrl ? (
            <Link to={blockExplorerUrl}>{`${recipientShort} `}</Link>
          ) : (
            `${recipientShort} `
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
};

export default Msg;
