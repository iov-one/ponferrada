import { TokenTicker, TxCodec } from "@iov/bcp";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Back, Block, Button, Form, useForm } from "medulas-react-components";
import React from "react";

import CurrencyToSend from "./CurrencyToSend";
import ReceiverAddress from "./ReceiverAddress";
import TextNote from "./TextNote";

const useStyles = makeStyles((theme: Theme) => ({
  payment: {
    backgroundColor: theme.palette.background.default,
    gridTemplateColumns: "1fr minmax(375px, 450px) 1fr",
    gridTemplateAreas: `
  ". currency-to-send ."
  ". receiver-address ."
  ". text-note        ."
  ". continue-button  ."
  `,
    gridGap: "24px",
    placeItems: "center",
  },

  currencyToSend: {
    gridArea: "currency-to-send",
  },

  receiverAddress: {
    gridArea: "receiver-address",
  },

  textNote: {
    gridArea: "text-note",
  },

  continue: {
    gridArea: "continue-button",
  },
}));

interface Props {
  readonly onSubmit: (values: object) => Promise<void>;
  readonly onCancelPayment: () => void;
  readonly onTokenSelectionChanged: (ticker: TokenTicker) => Promise<void>;
  readonly selectedChainCodec: TxCodec | null;
}

const Layout = ({
  onSubmit,
  onCancelPayment,
  onTokenSelectionChanged,
  selectedChainCodec,
}: Props): JSX.Element => {
  const classes = useStyles();

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Block
        marginTop={4}
        width="100%"
        height="auto"
        minHeight="100vh"
        display="grid"
        alignContent="center"
        justifyContent="center"
        className={classes.payment}
      >
        <Block width="100%" className={classes.currencyToSend}>
          <CurrencyToSend form={form} onTokenSelectionChanged={onTokenSelectionChanged} />
        </Block>
        <Block width="100%" className={classes.receiverAddress}>
          <ReceiverAddress form={form} selectedChainCodec={selectedChainCodec} />
        </Block>
        <Block width="100%" className={classes.textNote}>
          <TextNote form={form} />
        </Block>
        <Block width="75%" className={classes.continue}>
          <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
            Continue
          </Button>
          <Back fullWidth disabled={submitting} onClick={onCancelPayment}>
            Cancel
          </Back>
        </Block>
      </Block>
    </Form>
  );
};

export default Layout;
