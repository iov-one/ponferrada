import { Address, Algorithm, ChainId, PubkeyBytes, TokenTicker } from "@iov/bcp";
import { Encoding } from "@iov/encoding";
import TestUtils from "react-dom/test-utils";
import { DeepPartial, Store } from "redux";

import { extensionRpcEndpoint } from "../../communication/extensionRpcEndpoint";
import { ledgerRpcEndpoint } from "../../communication/ledgerRpcEndpoint";
import { TRANSACTIONS_TEXT } from "../../components/Header/components/LinksMenu";
import { aNewStore } from "../../store";
import { AccountsState } from "../../store/accounts";
import { BalanceState } from "../../store/balances";
import { ExtendedIdentity, IdentitiesState } from "../../store/identities";
import { RootState } from "../../store/reducers";
import { click, expectRoute } from "../../utils/test/dom";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { TRANSACTIONS_ROUTE } from "../paths";
import { getIovname, getLedgerIovnameWarning, getNoFundsMessage } from "./test/operateBalances";
import { travelToBalance } from "./test/travelToBalance";

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
const accounts: DeepPartial<AccountsState> = [
  {
    name: "albert",
    domain: "iov",
    addresses: [
      {
        chainId: bnsChainId,
        address: "some_address",
      },
    ],
  } as any,
];

const identities: IdentitiesState = new Map<ChainId, ExtendedIdentity>([
  [
    bnsChainId,
    {
      identity: {
        chainId: bnsChainId,
        pubkey: {
          algo: Algorithm.Ed25519,
          data: Encoding.fromHex("aabbccdd") as PubkeyBytes,
        },
      },
      address: "tiov97g97g9" as Address,
      chainName: "IOV Local Devnet",
    },
  ],
]);

describe("The /balance route", () => {
  let store: Store<RootState>;
  let balanceDom: React.Component;
  describe("with balance and iovname", () => {
    beforeEach(async () => {
      store = aNewStore({
        identities: identities,
        balances: balancesAmount,
        accounts: accounts,
        rpcEndpoint: extensionRpcEndpoint,
      });
      balanceDom = await travelToBalance(store);
    });

    it("redirects to the /transactions route when clicked", async () => {
      const transactionsCard = (await findRenderedDOMComponentWithId(
        balanceDom,
        TRANSACTIONS_TEXT,
      )) as Element;

      expect(transactionsCard.textContent).toBe(TRANSACTIONS_TEXT);

      await click(transactionsCard);
      expectRoute(TRANSACTIONS_ROUTE);
    }, 15000);

    it("should check list of available balances", async () => {
      const balances = TestUtils.scryRenderedDOMComponentsWithClass(balanceDom, "MuiTypography-colorPrimary");

      expect(balances.length).toBe(2);

      expect(balances[0].textContent).toBe("8.25 BASH");
      expect(balances[1].textContent).toBe("12.26775 CASH");
    });
  });

  describe("without balance and iovname with extension RPC Endpoint", () => {
    beforeEach(async () => {
      store = aNewStore({
        identities,
        rpcEndpoint: extensionRpcEndpoint,
      });
      balanceDom = await travelToBalance(store);
    });

    it("should show that there is no balance available", async () => {
      const noFundsMessage = getNoFundsMessage(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, "h6"));

      expect(noFundsMessage).toBe("You have no funds available");
    });

    it("should show that there is no iovname available", async () => {
      const noIovnameMessage = getIovname(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, "h6"));

      expect(noIovnameMessage).toBe("You have no iovnames");
    });
  });

  describe("without balance and iovname with Ledger RPC Endpoint", () => {
    beforeEach(async () => {
      store = aNewStore({
        identities,
        rpcEndpoint: ledgerRpcEndpoint,
      });
      balanceDom = await travelToBalance(store);
    });

    it("should show that there is no iovname available", async () => {
      const noIovnameMessage = getLedgerIovnameWarning(
        TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, "p"),
      );

      expect(noIovnameMessage).toBe("You can not register");
    });
  });
});
