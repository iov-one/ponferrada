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
  Link,
} from "medulas-react-components";
import React, { useContext, useState } from "react";
import { TransactionEncoder } from "@iov/encoding";

import { PersonaContext } from "../../../../../../context/PersonaProvider";
import { getMigrationSignature } from "../../../../../../utils/chrome";

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
    padding: "16px 16px 16px 16px",
    backgroundColor: "#FCFCFC",
  },
  wordsContainer: {
    backgroundColor: "#FCFCFC",
  },
});

const Migration = (): JSX.Element => {
  const classes = useStyles();
  const [iov1address, setIov1address] = useState("");
  const [star1address, setStar1address] = useState("");
  const [statuscode, setStatuscode] = useState("");
  const [chainid, setChainid] = useState("");

  const toast = useContext(ToastContext);

  const submitMigrationRequest = async (formValues: FormValues): Promise<void> => {
    /* eslint-disable no-console */
    const signature = await getMigrationSignature();
    console.log(signature);
    const jsonSignature = TransactionEncoder.toJson(signature);

    /* eslint-enable no-console */
    setIov1address(signature.transaction.sender);
    setStar1address(signature.transaction.memo);
    setChainid(signature.transaction.chainId);
    // toast.show("Incorrect password", ToastVariant.ERROR);

    try {
      let url;
      if (signature.transaction.chainId == "local-iov-devnet") {
        url = "http://localhost:3000/signatures";
      } else {
        url = "http://kip-metadata-demo.herokuapp.com/signatures";
      }

      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iov1: signature.transaction.sender,
          neuma_signature: JSON.stringify(jsonSignature),
        }),
      });

      if (!response.ok) throw response;

      const data = await response.json();
      console.log(data.txid);
      setStatuscode(data.txid);
    } catch (e) {
      console.error(e);
    }
  };

  const validate = (values: object): object => {
    const formValues = values as FormValues;
    const errors: ValidationError = {};
    return errors;
  };

  const { form, handleSubmit } = useForm({
    onSubmit: submitMigrationRequest,
    validate,
  });

  return (
    <Block marginLeft={3} marginRight={3}>
      <Typography variant="subtitle1" className={classes.textLines}>
        To migrate please press the green button. After signature verification, the IOV support will start the
        migration of your token.
      </Typography>
      <Block marginTop={4} />
      <Block marginTop={1} />

      <Form onSubmit={handleSubmit}>
        <Block display="flex" alignItems="flex-start"></Block>
        <Block marginTop={2} />
        <Button fullWidth type="submit">
          Request Migration
        </Button>
      </Form>
      <br />
      <br />
      <br />
      {iov1address && (
        <Block padding={2} border="1px solid #E0E0E0" borderRadius="4px">
          Status
          <br />
          <br />
          {!statuscode && <b>Pending</b>}
          {!!statuscode && <Link to={statuscode}>Migration Complete</Link>}
          <br />
          <br />
          {chainid}
          <br />
          <br />
          {iov1address}
          <br />
          <br />
          {star1address}
        </Block>
      )}
    </Block>
  );
};

export default Migration;
