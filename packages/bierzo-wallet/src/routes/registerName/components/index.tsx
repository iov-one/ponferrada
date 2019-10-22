import { faRegistered } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Back, Block, Button, Form, TextField, useForm } from "medulas-react-components";
import React from "react";

import AddressesTable, { AddressesTableProps } from "../../../components/AddressesTable";
import PageContent from "../../../components/PageContent";

export const REGISTER_USERNAME_VIEW_ID = "register-username-view-id";
export const REGISTER_USERNAME_FIELD = "register-username-field";

const registerIcon = <FontAwesomeIcon icon={faRegistered} color="#ffffff" />;

interface Props extends AddressesTableProps {
  readonly onSubmit: (values: object) => Promise<void>;
  readonly validate: (values: object) => Promise<object>;
  readonly onCancel: () => void;
}

const Layout = ({ chainAddresses, validate, onSubmit, onCancel }: Props): JSX.Element => {
  const { form, handleSubmit, invalid, pristine, submitting, validating } = useForm({
    onSubmit,
    validate,
  });

  const buttons = (
    <Block
      marginTop={4}
      marginBottom={1}
      justifyContent="center"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Block width="75%">
        <Button
          fullWidth
          type="submit"
          disabled={invalid || pristine || submitting || validating}
          spinner={submitting || validating}
        >
          Register
        </Button>
      </Block>
      <Block width="75%" marginTop={1}>
        <Back fullWidth disabled={submitting} onClick={onCancel}>
          Cancel
        </Back>
      </Block>
    </Block>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <PageContent id={REGISTER_USERNAME_VIEW_ID} icon={registerIcon} buttons={buttons} avatarColor="#31E6C9">
        <Block width="100%" marginTop={2} marginBottom={1}>
          <TextField
            name={REGISTER_USERNAME_FIELD}
            form={form}
            placeholder="eg. username*iov"
            fullWidth
            margin="none"
          />
        </Block>
        <Block width="100%" marginTop={2} marginBottom={1}>
          <AddressesTable chainAddresses={chainAddresses} />
        </Block>
      </PageContent>
    </Form>
  );
};

export default Layout;
