import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Back from 'medulas-react-components/lib/components/Button/Back';
import Form, { FormValues, useForm } from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import {
  composeValidators,
  numberOfWords,
  required,
} from 'medulas-react-components/lib/utils/forms/validators';
import * as React from 'react';
import { useMemo } from 'react';
import { RESTORE_ACCOUNT } from '../../paths';

export const MNEMONIC_FIELD = 'mnemonicField';
export const MNEMONIC_NUM_WORDS = 12;

interface Props {
  readonly onSetMnemonic: (values: FormValues) => void;
  readonly onBack: () => void;
}

const SetMnemonicForm = ({ onSetMnemonic, onBack }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    onSetMnemonic(formValues);
  };

  const { form, handleSubmit, submitting, invalid } = useForm({ onSubmit });

  //TODO optimize update of validators with array of dependencies
  const validator = useMemo(() => {
    return composeValidators(required, numberOfWords(MNEMONIC_NUM_WORDS));
  }, []);

  return (
    <PageLayout id={RESTORE_ACCOUNT} primaryTitle="Restore" title="Account">
      <Typography variant="subtitle1" inline>
        Restore your account with your recovery words. Enter your recovery words here.
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Block marginBottom={4}>
          <TextFieldForm
            multiline
            rows={5}
            placeholder="Recovery phrase"
            form={form}
            fullWidth
            name={MNEMONIC_FIELD}
            validate={validator}
          />
        </Block>
        <Block display="flex" justifyContent="space-between">
          <Block width={120}>
            <Back fullWidth onClick={onBack}>
              Back
            </Back>
          </Block>
          <Block width={120}>
            <Button fullWidth type="submit" disabled={invalid || submitting}>
              Continue
            </Button>
          </Block>
        </Block>
      </Form>
    </PageLayout>
  );
};

export default SetMnemonicForm;
