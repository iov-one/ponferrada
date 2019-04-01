import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import Form, {
  useForm,
  FormValues,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import { SIGNUP_ROUTE } from '../../paths';
import { UserData } from '../index';

export const SECURITY_HINT = 'securityHintField';

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
  readonly userData: UserData | null;
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
    <PageLayout id={SIGNUP_ROUTE} primaryTitle="New" title="Account">
      <Typography variant="subtitle2" inline>
        To help you remember your details in the future please provide a
        security hint:
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Block marginTop={1} marginBottom={1}>
          <TextFieldForm
            placeholder="Security hint"
            form={form}
            fullWidth
            name={SECURITY_HINT}
          />
        </Block>
        <Block display="flex" justifyContent="space-between">
          <Block width={120}>
            <Button fullWidth color="secondary" onClick={onBack}>
              Back
            </Button>
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
