import Paper from '@material-ui/core/Paper';
import { FormApi } from 'final-form';
import Block from 'medulas-react-components/lib/components/Block';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Tooltip from 'medulas-react-components/lib/components/Tooltip';
import Typography from 'medulas-react-components/lib/components/Typography';
import {
  composeValidators,
  notLongerThan,
  required,
} from 'medulas-react-components/lib/utils/forms/validators';
import React from 'react';

export const ADDRESS_FIELD = 'addressField';
const ADDRESS_MAX_LENGTH = 254;

interface Props {
  form: FormApi;
}

const validator = composeValidators(required, notLongerThan(ADDRESS_MAX_LENGTH));

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
