import { TokenTicker, TxCodec } from "@iov/bcp";
import { Back, Block, Button, Form, useForm } from "medulas-react-components";
import React from "react";

import CurrencyToSend from "./CurrencyToSend";
import ReceiverAddress from "./ReceiverAddress";
import TextNote from "./TextNote";

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
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Block marginTop={5} display="flex" justifyContent="center">
        <Block width="450px" display="flex" flexDirection="column" alignItems="center">
          <Block width="450px" bgcolor="white" padding={5}>
            <CurrencyToSend form={form} onTokenSelectionChanged={onTokenSelectionChanged} />
            <ReceiverAddress form={form} selectedChainCodec={selectedChainCodec} />
            <TextNote form={form} />
          </Block>
          <Block width="75%" marginTop={4}>
            <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
              Continue
            </Button>
            <Back fullWidth disabled={submitting} onClick={onCancelPayment}>
              Cancel
            </Back>
          </Block>
        </Block>
      </Block>
    </Form>
  );
};

export default Layout;
