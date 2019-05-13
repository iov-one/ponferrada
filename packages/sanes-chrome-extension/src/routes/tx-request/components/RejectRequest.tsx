import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Back from 'medulas-react-components/lib/components/Button/Back';
import Form, { useForm, FormValues } from 'medulas-react-components/lib/components/forms/Form';
import CheckboxField from 'medulas-react-components/lib/components/forms/CheckboxField';
import { TX_REQUEST } from '../../paths';
import Hairline from 'medulas-react-components/lib/components/Hairline';

const PERMANENT_REJECT = 'permanentRejectField';
export const TX_REQUEST_REJECT = `${TX_REQUEST}_reject`;

interface Props {
  readonly onRejectRequest: (permanent: boolean) => void;
  readonly onBack: () => void;
}

const Layout = ({ onBack, onRejectRequest }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    onRejectRequest(formValues[PERMANENT_REJECT] === 'true');
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <PageLayout id={TX_REQUEST_REJECT} primaryTitle="Transaction" title="Request">
      <Hairline />
      <Form onSubmit={handleSubmit}>
        <Block textAlign="center">
          <Typography variant="body1">You are not allowing</Typography>
          <Typography variant="body1" color="primary">
            http://finex.com
          </Typography>
          <Typography variant="body1" inline>
            to perform the following transaction to be made
          </Typography>

          <Block marginTop={1} />
          <CheckboxField
            initial={false}
            form={form}
            fieldName={PERMANENT_REJECT}
            label="Don't ask me again"
          />
        </Block>
        <Hairline />
        <Block marginTop={10} />
        <Button variant="contained" fullWidth type="submit" disabled={pristine || submitting}>
          Reject
        </Button>
        <Block marginTop={2} />
        <Back fullWidth onClick={onBack}>
          Back
        </Back>
      </Form>
    </PageLayout>
  );
};

export default Layout;
