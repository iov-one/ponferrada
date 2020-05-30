import {
  Block,
  Button,
  Form,
  FormValues,
  makeStyles,
  TextField,
  ToastContext,
  ToastVariant,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import React from "react";

import { PersonaContext } from "../../../../../../context/PersonaProvider";
import { clearDatabase, clearPersona } from "../../../../../../utils/chrome";
import { history } from "../../../../../../utils/history";
import { WELCOME_ROUTE } from "../../../../../paths";

export const MNEMONIC_FIELD = "mnemonicInputField";

const useStyles = makeStyles({
  deleteButtonEnabled: {
    "&&": {
      backgroundColor: "#f17f5c",
    },
  },
  deleteButtonDisabled: {
    "&&": {
      backgroundColor: "#f8bfae",
    },
  },
  disclaimer: {
    lineHeight: "1.3",
  },
});

const DeleteWallet = (): JSX.Element => {
  const classes = useStyles();

  const personaProvider = React.useContext(PersonaContext);
  const toast = React.useContext(ToastContext);

  const deleteWallet = async (): Promise<void> => {
    try {
      await clearPersona();
      await clearDatabase();
      personaProvider.update({
        hasStoredPersona: false,
      });
    } catch (error) {
      toast.show("An error has occurred during deleting wallet", ToastVariant.ERROR);
      console.error(error);
      return;
    }
    history.replace(WELCOME_ROUTE);
  };

  const validate = (values: object): object => {
    const formValues = values as FormValues;
    const errors: ValidationError = {};
    if (!formValues[MNEMONIC_FIELD]) {
      errors[MNEMONIC_FIELD] = "Required";
    } else if (personaProvider.mnemonic !== formValues[MNEMONIC_FIELD]) {
      errors[MNEMONIC_FIELD] = "Wrong mnemonic entered, please try again.";
    }

    return errors;
  };

  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit: deleteWallet,
    validate,
  });

  const isDeleteDisabled = invalid || pristine || submitting;
  const deleteButtonClass = isDeleteDisabled ? classes.deleteButtonDisabled : classes.deleteButtonEnabled;

  return (
    <Block marginLeft={3} marginRight={3}>
      <Typography variant="subtitle1" className={classes.disclaimer}>
        Are you sure want to completely delete this wallet? Please type current wallet recovery words into the
        field below.
      </Typography>
      <Block marginTop={4}>
        <Typography variant="subtitle1">Your recovery words</Typography>
      </Block>
      <Form onSubmit={handleSubmit}>
        <Block marginTop={1} marginBottom={2}>
          <TextField
            multiline
            rows={4}
            placeholder="Enter your recovery words here"
            form={form}
            required
            fullWidth
            margin="none"
            name={MNEMONIC_FIELD}
          />
        </Block>
        <Button
          fullWidth
          type="submit"
          disabled={isDeleteDisabled}
          spinner={submitting}
          className={deleteButtonClass}
        >
          Delete Wallet
        </Button>
      </Form>
    </Block>
  );
};

export default DeleteWallet;
