import { TransactionEncoder } from "@iov/encoding";
import {
  Block,
  Button,
  Form,
  FormValues,
  Link,
  makeStyles,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import React, { useState } from "react";

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

  const submitMigrationRequest = async (formValues: FormValues): Promise<void> => {
    const signature = await getMigrationSignature();
    const jsonSignature = TransactionEncoder.toJson(signature);

    setIov1address(signature.transaction.sender);
    setStar1address(signature.transaction.memo);
    setChainid(signature.transaction.chainId);

    try {
      let url;
      if (signature.transaction.chainId === "local-iov-devnet") {
        url = "http://localhost:3000/signatures";
      } else {
        url = "http://kip-metadata-demo.herokuapp.com/signatures";
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iov1: signature.transaction.sender,
          neuma: JSON.stringify(jsonSignature),
        }),
      });

      if (!response.ok) throw response;

      const data = await response.json();
      setStatuscode(data.txid);
    } catch (e) {
      console.error(e);
    }
  };

  const validate = (values: object): object => {
    const errors: ValidationError = {};
    return errors;
  };

  const { handleSubmit } = useForm({
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
