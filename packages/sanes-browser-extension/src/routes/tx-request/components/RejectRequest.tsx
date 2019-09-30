import {
  Back,
  Block,
  Button,
  CheckboxField,
  Form,
  FormValues,
  Hairline,
  Typography,
  useForm,
} from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../../components/NeumaPageLayout";
import { TX_REQUEST } from "../../paths";

const PERMANENT_REJECT = "permanentRejectField";
export const TX_REQUEST_REJECT = `${TX_REQUEST}_reject`;

interface Props {
  readonly onRejectRequest: (permanent: boolean) => void;
  readonly onBack: () => void;
  readonly sender: string;
}

const Layout = ({ sender, onBack, onRejectRequest }: Props): JSX.Element => {
  const onSubmit = (values: object): void => {
    const formValues = values as FormValues;
    const permanentReject = `${formValues[PERMANENT_REJECT]}` === "true";
    onRejectRequest(permanentReject);
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <NeumaPageLayout id={TX_REQUEST_REJECT} color="white" primaryTitle="Tx" title="Request">
      <Hairline />
      <Form onSubmit={handleSubmit}>
        <Block textAlign="center" marginTop={2}>
          <Typography variant="body1" inline>
            {"You are rejecting the tx sent from "}
          </Typography>
          <Typography variant="body1" color="primary" inline>
            {sender}
          </Typography>
          <Typography variant="body1">{" from being signed and posted."}</Typography>
          <Block marginTop={4} />
          <CheckboxField
            initial={false}
            form={form}
            fieldName={PERMANENT_REJECT}
            label="Also block future requests"
          />
        </Block>
        <Block marginTop={6} />
        <Button variant="contained" fullWidth type="submit" disabled={pristine || submitting}>
          Reject
        </Button>
        <Block marginTop={2} />
        <Back fullWidth onClick={onBack}>
          Back
        </Back>
      </Form>
    </NeumaPageLayout>
  );
};

export default Layout;
