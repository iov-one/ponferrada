import {
  Block,
  Button,
  Form,
  FormValues,
  Image,
  makeStyles,
  TextField,
  ToastContext,
  ToastVariant,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import React, { useContext, useState } from "react";

import { PersonaContext } from "../../../../../../context/PersonaProvider";
import { checkPassword } from "../../../../../../utils/chrome";
import lockIcon from "../../../../assets/lock.svg";

export const passwordField = "passwordInputField";
const passwordPlaceholder = "Enter your password";
const errorIncorrectPassword = "Incorrect password";

const useStyles = makeStyles({
  textLines: {
    lineHeight: "1.3",
  },
  lockIcon: {
    position: "absolute",
    marginTop: "16px",
    marginLeft: "16px",
    zIndex: 1,
  },
  password: {
    height: "24px",
    padding: "16px 16px 16px 56px",
    backgroundColor: "#FCFCFC",
  },
  wordsContainer: {
    backgroundColor: "#FCFCFC",
  },
});

const RecoveryWords = (): JSX.Element => {
  const classes = useStyles();

  const [showMnemonic, setShowMnemonic] = useState(false);

  const persona = useContext(PersonaContext);
  const toast = useContext(ToastContext);

  const checkMnemonicPassword = async (formValues: FormValues): Promise<void> => {
    const password = formValues[passwordField];
    let passwordValid = false;

    try {
      passwordValid = await checkPassword(password);
    } catch {
      toast.show(errorIncorrectPassword, ToastVariant.ERROR);
    }

    setShowMnemonic(passwordValid);
  };

  const validate = (values: object): object => {
    const formValues = values as FormValues;
    const errors: ValidationError = {};
    if (!formValues[passwordField]) {
      errors[passwordField] = "Required";
    }

    return errors;
  };

  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit: checkMnemonicPassword,
    validate,
  });

  return (
    <Block marginLeft={3} marginRight={3}>
      <Typography variant="subtitle1" className={classes.textLines}>
        The recovery words helps you recover your account in case you lose your password.
      </Typography>
      <Block marginTop={4} />
      <Typography variant="subtitle1">Reveal my recovery words</Typography>
      <Block marginTop={1} />
      {!showMnemonic && (
        <Form onSubmit={handleSubmit}>
          <Block display="flex" alignItems="flex-start">
            <Image alt="Lock" src={lockIcon} width="24px" className={classes.lockIcon} />
            <TextField
              placeholder={passwordPlaceholder}
              type="password"
              form={form}
              required
              fullWidth
              margin="none"
              name={passwordField}
              inputProps={{ className: classes.password }}
            />
          </Block>
          <Block marginTop={2} />
          <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
            Reveal Words
          </Button>
        </Form>
      )}
      {showMnemonic && (
        <Block
          padding={2}
          border="1px solid #E0E0E0"
          borderRadius="4px"
          display="flex"
          alignItems="flex-start"
          className={classes.wordsContainer}
        >
          <Image alt="Lock" src={lockIcon} width="24px" />
          <Block marginLeft={2} />
          <Typography variant="body1" className={classes.textLines}>
            {persona.mnemonic}
          </Typography>
        </Block>
      )}
    </Block>
  );
};

export default RecoveryWords;
