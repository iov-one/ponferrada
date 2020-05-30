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

export const rejectIdentityHtmlId = "identity-request-reject";
const PERMANENT_REJECT = "permanentRejectField";

interface Props {
  readonly onRejectRequest: (permanent: boolean) => void;
  readonly onBack: () => void;
  readonly sender: string;
}

const RejectIdentity = ({ sender, onBack, onRejectRequest }: Props): JSX.Element => {
  const onSubmit = (values: object): void => {
    const formValues = values as FormValues;
    const permanentReject = `${formValues[PERMANENT_REJECT]}` === "true";

    onRejectRequest(permanentReject);
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <Block id={rejectIdentityHtmlId}>
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
    </Block>
  );
};

export default RejectIdentity;
