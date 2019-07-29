import { TransactionId } from '@iov/bcp';
import { Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

interface Props {
  readonly transactionId: TransactionId;
}

const ConfirmPayment = ({ transactionId }: Props): JSX.Element => {
  const theme = useTheme<Theme>();

  return (
    <Block
      marginTop={4}
      alignContent="center"
      justifyContent="center"
      bgcolor={theme.palette.background.paper}
    >
      <Typography variant="body2" weight="semibold">
        Your transaction was successfully signed and sent to the network. ID: {transactionId}
      </Typography>
    </Block>
  );
};

export default ConfirmPayment;
