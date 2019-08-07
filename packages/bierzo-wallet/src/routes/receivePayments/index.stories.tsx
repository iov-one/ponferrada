import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";
import { DeepPartial } from "redux";

import { RootState } from "../../store/reducers";
import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import Layout from "./components";

export const RECEIVE_PAYMENT_STORY_PATH = `Receive Payment`;

const fullStore = (): DeepPartial<RootState> => {
  return {
    extension: {
      keys: {
        "local-iov-devnet":
          '{"chainId":"string:local-iov-devnet","pubkey":{"algo":"string:ed25519","data":"bytes:678430365f88ef68bd32019400903f9c9dced242ed363b5d5ba52ac8077f4377"}}',
        "lisk-198f2b61a8":
          '{"chainId":"string:lisk-198f2b61a8","pubkey":{"algo":"string:ed25519","data":"bytes:624b6b55aa0505521cc18c64387fb15a4c4c76ad74b7363dfc2c963862224cc2"}}',
        "ethereum-eip155-5777":
          '{"chainId":"string:ethereum-eip155-5777","pubkey":{"algo":"string:secp256k1","data":"bytes:0484c1870a4f7cab9555d8fc1b54f54e744df2eb80ef31bb2dfdbf403c5b06d70b21170ac0bb6bb4cf3f3699a2f26f2ff7ca1a87e86f36b5a27cc1185be559af92"}}',
      },
    },
  };
};

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    RECEIVE_PAYMENT_STORY_PATH,
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <Layout onReturnToBalance={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)} />
      </DecoratedStorybook>
    ),
  );
