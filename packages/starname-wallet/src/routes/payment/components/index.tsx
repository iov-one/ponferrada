import { TokenTicker, TxCodec } from "@iov/bcp";
import { Back, Block, Button, Form, useForm } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { CodecType, ConfigErc20Options, getConfig } from "../../../config";
import { RootState } from "../../../store/reducers";
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
  const [memoDisabled, setMemoDisabled] = React.useState(false);

  const balances = ReactRedux.useSelector((state: RootState) => state.balances);
  const noBalance = Object.keys(balances).length === 0;
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
  });
  const onTokenSelectionControl = async (ticker: TokenTicker): Promise<void> => {
    const chains = (await getConfig()).chains;
    const ethChain = chains.find(chain => chain.chainSpec.codecType === CodecType.Ethereum);
    const erc20s = ethChain?.chainSpec?.ethereumOptions?.erc20s;
    if (erc20s) {
      const erc20Tokens = erc20s as ConfigErc20Options[];
      setMemoDisabled(erc20Tokens.some(token => token.symbol.toUpperCase() === ticker.toUpperCase()));
    }
    onTokenSelectionChanged(ticker);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Block marginTop={5} display="flex" justifyContent="center">
        <Block width="450px" display="flex" flexDirection="column" alignItems="center">
          <Block width="450px" bgcolor="white" padding={5}>
            <CurrencyToSend
              form={form}
              balances={balances}
              noBalance={noBalance}
              onTokenSelectionControl={onTokenSelectionControl}
            />
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
