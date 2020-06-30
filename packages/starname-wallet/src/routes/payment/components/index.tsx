import { TokenTicker, TxCodec } from "@iov/bcp";
import { Back, Block, Button, Form, useForm } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../store/reducers";
import ReceiverAddress from "./ReceiverAddress";
import TextNote from "./TextNote";

interface Props {
  readonly onSubmit: (values: object) => Promise<void>;
  readonly onCancelPayment: () => void;
  readonly onTokenSelectionChanged: (ticker: TokenTicker) => Promise<void>;
  readonly selectedChainCodec: TxCodec | null;
}

const Layout = ({ onSubmit, onCancelPayment, selectedChainCodec }: Props): JSX.Element => {
  const [memoDisabled] = React.useState(false);

  const balances = ReactRedux.useSelector((state: RootState) => state.balances);
  const noBalance = Object.keys(balances).length === 0;
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Block marginTop={5} display="flex" justifyContent="center">
        <Block width="450px" display="flex" flexDirection="column" alignItems="center">
          <Block width="450px" bgcolor="white" padding={5}>
            <ReceiverAddress form={form} noBalance={noBalance} selectedChainCodec={selectedChainCodec} />
            <TextNote form={form} noMemo={noBalance || memoDisabled} />
          </Block>
          <Block width="75%" marginTop={4}>
            <Button fullWidth type="submit" disabled={invalid || pristine || submitting || noBalance}>
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
