import { TokenTicker } from "@iov/bcp";
import TestUtils from "react-dom/test-utils";
import { DeepPartial, Store } from "redux";

import { TRANSACTIONS_TEXT } from "../../components/Header/components/LinksMenu";
import { aNewStore } from "../../store";
import { BalanceState } from "../../store/balances";
import { RootState } from "../../store/reducers";
import { UsernamesState } from "../../store/usernames";
import { click, expectRoute } from "../../utils/test/dom";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { ADDRESSES_ROUTE, PAYMENT_ROUTE, TRANSACTIONS_ROUTE } from "../paths";
import { getIovUsername, getNoFundsMessage } from "./test/operateBalances";
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
};

const bnsChainId = "local-iov-devnet";
const usernames: DeepPartial<UsernamesState> = [
  {
    username: "albert*iov",
    addresses: [
      {
        chainId: bnsChainId,
        address: "some_address",
      },
    ],
  },
];

describe("The /balance route", () => {
  let store: Store<RootState>;
  let balanceDom: React.Component;
  describe("with balance", () => {
    beforeEach(
      async (): Promise<void> => {
        store = aNewStore({
          extension: {
            connected: true,
            installed: true,
            identities: {},
          },
          balances: balancesAmount,
          usernames,
        });
        balanceDom = await travelToBalance(store);
      },
    );

    it("redirects to the /payment route when clicked", async () => {
      const paymentCard = (await findRenderedDOMComponentWithId(balanceDom, PAYMENT_ROUTE)) as Element;

      expect(paymentCard.textContent).toBe("Send payment");

      await click(paymentCard);
      expectRoute(PAYMENT_ROUTE);
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

    it("redirects to the /receive-from-iov route when clicked", async () => {
      const receiveCard = (await findRenderedDOMComponentWithId(balanceDom, ADDRESSES_ROUTE)) as Element;

      expect(receiveCard.textContent).toBe("Receive Payment");

      await click(receiveCard);
      expectRoute(ADDRESSES_ROUTE);
    });

    it("should check list of available balances", async () => {
      const balances = TestUtils.scryRenderedDOMComponentsWithClass(balanceDom, "MuiTypography-colorPrimary");

      expect(balances.length).toBe(2);

      expect(balances[0].textContent).toBe("8.25 BASH");
      expect(balances[1].textContent).toBe("12.26775 CASH");
    });

    it("should show bns username", async () => {
      const usernameMessage = getIovUsername(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, "h5"));

      expect(usernameMessage).toBe("albert*iov");
    });
  });

  describe("without balance and username", () => {
    beforeEach(
      async (): Promise<void> => {
        store = aNewStore({
          extension: {
            connected: true,
            installed: true,
            identities: {},
          },
        });
        balanceDom = await travelToBalance(store);
      },
    );

    it("should show that there is no balance available", async () => {
      const noFundsMessage = getNoFundsMessage(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, "h6"));

      expect(noFundsMessage).toBe("No funds available");
    });

    it("should show that there is no bns username available", async () => {
      const noUsernameMessage = getIovUsername(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, "h5"));

      expect(noUsernameMessage).toBe("Get your human readable");
    });
  });
});
