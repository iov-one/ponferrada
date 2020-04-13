import { Address, Amount, ChainId, TokenTicker } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import { Storybook, ToastProvider } from "medulas-react-components";
import React from "react";

import { PersonaProvider } from "../../context/PersonaProvider";
import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { sanesRoot } from "../../utils/storybook";
import Layout from "./index";

export const WALLET_STATUS_PAGE = "Wallet Status page";

storiesOf(`${sanesRoot}/${WALLET_STATUS_PAGE}`, module)
  .add("With balances", () => {
    const balance1: readonly Amount[] = [
      { quantity: "10000", fractionalDigits: 2, tokenTicker: "ETH" as TokenTicker },
    ];
    const balance2: readonly Amount[] = [
      { quantity: "10000", fractionalDigits: 4, tokenTicker: "LSK" as TokenTicker },
    ];

    const persona: GetPersonaResponse = {
      mnemonic: "",
      connectedChains: ["local-iov-devnet" as ChainId],
      getAccounts: () => new Promise(resolve => resolve([{ label: "Account 0", iovAddress: "" as Address }])),
      getBalances: () => new Promise(resolve => resolve([balance1, balance2])),
      getNames: () => new Promise(resolve => resolve([])),
    };

    return (
      <PersonaProvider persona={persona} hasStoredPersona={true}>
        <Storybook>
          <ToastProvider>
            <Layout />
          </ToastProvider>
        </Storybook>
      </PersonaProvider>
    );
  })
  .add("No balances", () => {
    const persona: GetPersonaResponse = {
      mnemonic: "",
      connectedChains: ["local-iov-devnet" as ChainId],
      getAccounts: () => new Promise(resolve => resolve([{ label: "Account 0", iovAddress: "" as Address }])),
      getBalances: () => new Promise(resolve => resolve([])),
      getNames: () => new Promise(resolve => resolve([])),
    };

    return (
      <PersonaProvider persona={persona} hasStoredPersona={true}>
        <Storybook>
          <ToastProvider>
            <Layout />
          </ToastProvider>
        </Storybook>
      </PersonaProvider>
    );
  });
