import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Back from 'medulas-react-components/lib/components/Button/Back';
import CheckboxField from 'medulas-react-components/lib/components/forms/CheckboxField';
import Form, { FormValues, useForm } from 'medulas-react-components/lib/components/forms/Form';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { TX_REQUEST } from '../../paths';

const PERMANENT_REJECT = 'permanentRejectField';
export const TX_REQUEST_REJECT = `${TX_REQUEST}_reject`;

interface Props {
  readonly onRejectRequest: (permanent: boolean) => void;
  readonly onBack: () => void;
}

const Layout = ({ onBack, onRejectRequest }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    const permanentReject = `${formValues[PERMANENT_REJECT]}` === 'true';
    onRejectRequest(permanentReject);
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <PageLayout id={TX_REQUEST_REJECT} primaryTitle="Transaction" title="Request">
      <Hairline />
      <Form onSubmit={handleSubmit}>
        <Block textAlign="center" marginTop={2}>
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
        <Block marginTop={2} marginBottom={2}>
          <Block display="flex" alignItems="center">
            <Block flex="1 0 1px">
              <Block marginLeft={6}>
                <Typography variant="body1">Fee</Typography>
              </Block>
            </Block>
            <Block flex="1 0 1px">
              <Typography variant="h6">0,0288 ETH</Typography>
            </Block>
          </Block>
          <Block display="flex" alignItems="center">
            <Block flex="1 0 1px">
              <Block marginLeft={6}>
                <Typography variant="body1">Register</Typography>
              </Block>
            </Block>
            <Block flex="1 0 1px">
              <Typography variant="h6">billy*iov</Typography>
            </Block>
          </Block>
        </Block>
        <Hairline />
        <Block marginTop={4} />
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
