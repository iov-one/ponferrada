import {
  Back,
  Block,
  Button,
  CheckboxField,
  Form,
  FormValues,
  Typography,
  useForm,
} from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../../components/NeumaPageLayout";
import { SHARE_IDENTITY } from "../../paths";

const PERMANENT_REJECT = "permanentRejectField";
export const SHARE_IDENTITY_REJECT = `${SHARE_IDENTITY}_reject`;

interface Props {
  readonly onRejectRequest: (permanent: boolean) => void;
  readonly onBack: () => void;
  readonly sender: string;
}

const Layout = ({ sender, onBack, onRejectRequest }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    const permanentReject = `${formValues[PERMANENT_REJECT]}` === "true";

    onRejectRequest(permanentReject);
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <NeumaPageLayout id={SHARE_IDENTITY_REJECT} color="white" primaryTitle="Share" title="Identity">
      <Form onSubmit={handleSubmit}>
        <Block textAlign="center">
          <Typography variant="body1">The following site:</Typography>
          <Typography variant="body1" color="primary">
            {sender}
          </Typography>
          <Typography variant="body1" inline color="error">
            would not be able to request
          </Typography>
          <Typography variant="body1" inline>
            {" "}
            your identity on blockchains.
          </Typography>
          <Block marginTop={2} />
          <CheckboxField
            initial={false}
            form={form}
            fieldName={PERMANENT_REJECT}
            label="Also block future requests"
          />
        </Block>
        <Block marginTop={10} />
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
