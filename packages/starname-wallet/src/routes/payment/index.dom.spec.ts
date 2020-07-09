import { Algorithm, ChainId, PubkeyBytes, TokenTicker } from "@iov/bcp";
import { Encoding } from "@iov/encoding";
import TestUtils from "react-dom/test-utils";
import { DeepPartial, Store } from "redux";

import { extensionRpcEndpoint } from "../../communication/extensionRpcEndpoint";
import { aNewStore } from "../../store";
import { BalanceState } from "../../store/balances";
import { RootState } from "../../store/reducers";
import { click, expectRoute } from "../../utils/test/dom";
import { BALANCE_ROUTE } from "../paths";
import { getCancelButton, getSelectedCurrency } from "./test/operatePayment";
import { travelToPayment } from "./test/travelToPayment";

const balancesAmount: DeepPartial<BalanceState> = {
  BASH: {
    quantity: "82500",
    fractionalDigits: 4,
    tokenTicker: "BASH" as TokenTicker,
  },
  CASH: {
    quantity: "1226775",
    fractionalDigits: 5,
    tokenTicker: "CASH" as TokenTicker,
  },
} as any;

const bnsChainId = "local-iov-devnet" as ChainId;
const identities = new Map([
  [
    bnsChainId,
    {
      chainId: bnsChainId,
      pubkey: {
        algo: Algorithm.Ed25519,
        data: Encoding.fromHex("aabbccdd") as PubkeyBytes,
      },
    },
  ],
]);

describe("The /payment route", () => {
  let store: Store<RootState>;
  let paymentDom: React.Component;
  beforeEach(async () => {
    store = aNewStore({
      identities,
      balances: balancesAmount,
      rpcEndpoint: extensionRpcEndpoint,
    });
    paymentDom = await travelToPayment(store);
  });

  it("should redirect to the /balance route when cancel clicked", async () => {
    const cancelButton = getCancelButton(paymentDom);
    await click(cancelButton);

    expectRoute(BALANCE_ROUTE);
  });

  it("should set first currency in list as default", async () => {
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(paymentDom, "input");
    const selectedCurrency = getSelectedCurrency(inputs);
    expect(selectedCurrency).toEqual(Object.keys(balancesAmount)[0]);
  });
});
