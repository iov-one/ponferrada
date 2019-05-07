import Paper from '@material-ui/core/Paper';
import Block from 'medulas-react-components/lib/components/Block';
import Form, {
  FormValues,
  useForm,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Tooltip from 'medulas-react-components/lib/components/Tooltip';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

const ADDRESS_FIELD = 'addressField';

const onSubmit = (): void => {};

const validate = (values: object): object => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  if (!formValues[ADDRESS_FIELD]) {
    errors[ADDRESS_FIELD] = 'Required';
  }

  if (formValues[ADDRESS_FIELD] && formValues[ADDRESS_FIELD].length > 254) {
    errors[ADDRESS_FIELD] = 'Can not be longer than 254 characters';
  }

  //TODO implement valid pattern
  if (formValues[ADDRESS_FIELD] && !formValues[ADDRESS_FIELD].endsWith('*iov')) {
    errors[ADDRESS_FIELD] = 'Invalid address';
  }

  return errors;
};

const ReceiverAddress = (): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit,
    validate,
  });

  return (
    <Paper>
      <Block display="flex" flexDirection="column" width="100%" padding={5}>
        <Typography color="textPrimary" variant="subtitle2">
          To
        </Typography>
        <Block width="100%" marginTop={2} marginBottom={1}>
          <Form onSubmit={handleSubmit}>
            <TextFieldForm
              name={ADDRESS_FIELD}
              form={form}
              required
              placeholder="IOV or wallet address"
              fullWidth
              margin="none"
            />
          </Form>
        </Block>
        <Block display="flex" alignSelf="flex-end" marginTop={3}>
          <Typography color="textPrimary" variant="subtitle1">
            How it works
          </Typography>
          <Block alignSelf="center" marginLeft={1}>
            {/*TODO add info popup*/}
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
