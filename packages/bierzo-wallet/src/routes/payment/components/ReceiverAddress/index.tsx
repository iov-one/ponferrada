import { bnsCodec } from '@iov/bns';
import { ethereumCodec } from '@iov/ethereum';
import { liskCodec } from '@iov/lisk';
import Paper from '@material-ui/core/Paper';
import { FieldValidator, FormApi } from 'final-form';
import Block from 'medulas-react-components/lib/components/Block';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Tooltip from 'medulas-react-components/lib/components/Tooltip';
import Typography from 'medulas-react-components/lib/components/Typography';
import { composeValidators, required } from 'medulas-react-components/lib/utils/forms/validators';
import React from 'react';

import { isIov } from '../../../../logic/account';

export const ADDRESS_FIELD = 'addressField';

function isNativeBlockchainAddress(input: string): boolean {
  return (
    bnsCodec.isValidAddress(input) || ethereumCodec.isValidAddress(input) || liskCodec.isValidAddress(input)
  );
}

const recipientValidator: FieldValidator = (value): string | undefined => {
  if (typeof value !== 'string') throw new Error('Input must be a string');

  if (isNativeBlockchainAddress(value) || isIov(value)) {
    return undefined;
  } else {
    return 'Must be an IOV human readable address or a native address';
  }
};

interface Props {
  form: FormApi;
}

const validator = composeValidators(required, recipientValidator);

const ReceiverAddress = (props: Props): JSX.Element => {
  return (
    <Paper>
      <Block display="flex" flexDirection="column" width="100%" padding={5}>
        <Typography color="textPrimary" variant="subtitle2">
          To
        </Typography>
        <Block width="100%" marginTop={2} marginBottom={1}>
          <TextFieldForm
            name={ADDRESS_FIELD}
            form={props.form}
            validate={validator}
            placeholder="IOV or wallet address"
            fullWidth
            margin="none"
          />
        </Block>
        <Block display="flex" alignSelf="flex-end" marginTop={3}>
          <Typography color="textPrimary" variant="subtitle1">
            How it works
          </Typography>
          <Block alignSelf="center" marginLeft={1}>
            <Tooltip>
              <Typography variant="body2">
                Send payments to anyone with an IOV handle, and it will go directly to their account. If they
                don’t have an IOV account add their blockchain address.
              </Typography>
            </Tooltip>
          </Block>
        </Block>
      </Block>
    </Paper>
  );
};

export default ReceiverAddress;
