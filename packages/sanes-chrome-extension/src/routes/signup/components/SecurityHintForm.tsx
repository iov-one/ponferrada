import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Back from 'medulas-react-components/lib/components/Button/Back';
import Form, {
  FormValues,
  useForm,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { SIGNUP_ROUTE } from '../../paths';

export const SECURITY_HINT = 'securityHintField';
export const SECURITY_HINT_STEP_SIGNUP_ROUTE = `${SIGNUP_ROUTE}3`;

const validate = (values: object): object => {
  const formValues = values as FormValues;
  let errors: ValidationError = {};

  if (formValues[SECURITY_HINT] && formValues[SECURITY_HINT].length > 15) {
    errors[SECURITY_HINT] = '15 characters max - Spaces are allowed';
  }

  return errors;
};

interface Props {
  readonly onSaveHint: (values: FormValues) => void;
  readonly onBack: () => void;
}

const SecurityHintForm = ({ onSaveHint, onBack }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    onSaveHint(formValues);
  };

  const { form, handleSubmit, submitting, invalid } = useForm({
    onSubmit,
    validate,
  });

  return (
    <PageLayout id={SECURITY_HINT_STEP_SIGNUP_ROUTE} primaryTitle="New" title="Account">
      <Typography variant="subtitle1" inline>
        To help you remember your details in the future please provide a security hint:
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Block marginTop={1} marginBottom={4}>
          <TextFieldForm placeholder="Security hint" form={form} fullWidth name={SECURITY_HINT} />
        </Block>
        <Block display="flex" justifyContent="space-between">
          <Block width={120}>
            <Back fullWidth onClick={onBack}>
              Back
            </Back>
          </Block>
          <Block width={120}>
            <Button fullWidth type="submit" disabled={invalid || submitting}>
              Create
            </Button>
          </Block>
        </Block>
      </Form>
    </PageLayout>
  );
};

export default SecurityHintForm;
