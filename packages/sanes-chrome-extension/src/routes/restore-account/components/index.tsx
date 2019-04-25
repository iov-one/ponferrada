import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Block from 'medulas-react-components/lib/components/Block';
import Back from 'medulas-react-components/lib/components/Button/Back';
import Typography from 'medulas-react-components/lib/components/Typography';
import Form, {
  useForm,
  FormValues,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';

export const RECOVERY_PHRASE = 'recoveryPhraseField';

const validate = (values: object): object => {
  const formValues = values as FormValues;
  let errors: ValidationError = {};

  if (formValues[RECOVERY_PHRASE] && formValues[RECOVERY_PHRASE].split(' ').length !== 12) {
    errors[RECOVERY_PHRASE] = 'Recovery phrase should contain 12 words only.';
  }

  return errors;
};

interface Props {
  readonly onRestoreAccount: (values: FormValues) => void;
  readonly onBack: () => void;
}

const RestoreAccountForm = ({ onRestoreAccount, onBack }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    onRestoreAccount(formValues);
  };

  const { form, handleSubmit, submitting, invalid } = useForm({
    onSubmit,
    validate,
  });

  return (
    <PageLayout primaryTitle="Restore" title="Account">
      <Typography variant="subtitle1" inline>
        Restore your account with your recovery words. Enter your recovery words here.
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Block marginTop={1} marginBottom={4}>
          <TextFieldForm placeholder="Recovery phrase" form={form} fullWidth name={RECOVERY_PHRASE} />
        </Block>
        <Block display="flex" justifyContent="space-between">
          <Block width={120}>
            <Back fullWidth onClick={onBack}>
              Back
            </Back>
          </Block>
          <Block width={120}>
            <Button fullWidth type="submit" disabled={invalid || submitting}>
              Restore
            </Button>
          </Block>
        </Block>
      </Form>
    </PageLayout>
  );
};

export default RestoreAccountForm;
