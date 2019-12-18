import {
  Address,
  Algorithm,
  Amount,
  ChainId,
  Identity,
  PubkeyBytes,
  SendTransaction,
  TokenTicker,
  WithCreator,
} from "@iov/bcp";
import {
  ActionKind,
  bnsCodec,
  CreateProposalTx,
  RegisterUsernameTx,
  UpdateTargetsOfUsernameTx,
  VoteOption,
  VoteTx,
} from "@iov/bns";
import { Encoding } from "@iov/encoding";
import { ethereumCodec } from "@iov/ethereum";
import TestUtils from "react-dom/test-utils";

import { click, submit } from "../../../utils/test/dom";
import { findRenderedDOMComponentWithId } from "../../../utils/test/reactElemFinder";
import { rejectTxHtmlId } from "../components/SidePanel/PanelDrawer/components/Requests/ShowRequest/SignAndPostTx/RejectTx";
import { showTxHtmlId } from "../components/SidePanel/PanelDrawer/components/Requests/ShowRequest/SignAndPostTx/ShowTx";

const defaultAddress = "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address;
const defaultCreator: Identity = {
  chainId: "some-chain" as ChainId,
  pubkey: {
    algo: Algorithm.Ed25519,
    // Random 32 bytes pubkey. Derived IOV address:
    // tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3 / 6e1114f57410d8e7bcd910a568c9196efc1479e4
    data: Encoding.fromHex("7196c465e4c95b3dce425784f51936b95da6bc58b3212648cdca64ee7198df47") as PubkeyBytes,
  },
};

const defaultAmount: Amount = {
  quantity: "1000000001",
  fractionalDigits: 9,
  tokenTicker: "CASH" as TokenTicker,
};
const ethereumCreator: Identity = {
  chainId: "ethereum-eip155-5777" as ChainId,
  pubkey: {
    algo: Algorithm.Secp256k1,
    // Random Ethereum pubkey. Derived address: 0x7c15484EA11FD233AE566469af15d84335023c30
    data: Encoding.fromHex(
      "0434ce248a6a5979c04d75d1a75907b2bec1cb4d4f6e17b76521f0925e8b6b40e00711fe98e789cf5c8317cf1e731b3101e9dbfaba5e351e424e45c9a2f4dfb63c",
    ) as PubkeyBytes,
  },
};

const gasPrice = {
  quantity: "20000000000", // 20 Gwei
  fractionalDigits: 18,
  tokenTicker: "ETH" as TokenTicker,
};

export function getCashTransaction(): SendTransaction & WithCreator {
  return {
    kind: "bcp/send",
    creator: defaultCreator,
    sender: bnsCodec.identityToAddress(defaultCreator),
    amount: defaultAmount,
    recipient: defaultAddress,
    memo: "paid transaction",
    fee: {
      tokens: defaultAmount,
    },
  };
}

export function getEthTransaction(): SendTransaction & WithCreator {
  return {
    kind: "bcp/send",
    creator: ethereumCreator,
    sender: ethereumCodec.identityToAddress(ethereumCreator),
    amount: {
      quantity: "1230000000000000000", // 1.23 ETH
      fractionalDigits: 18,
      tokenTicker: "ETH" as TokenTicker,
    },
    recipient: defaultAddress,
    memo: "paid transaction",
    fee: {
      gasLimit: "123000000",
      gasPrice,
    },
  };
}

export function getUsernameTransaction(): RegisterUsernameTx & WithCreator {
  return {
    kind: "bns/register_username",
    creator: defaultCreator,
    username: "test*iov",
    targets: [{ chainId: "foobar" as ChainId, address: defaultAddress }],
    fee: {
      tokens: defaultAmount,
    },
  };
}

export function getUpdateUsernameTargetsTransaction(): UpdateTargetsOfUsernameTx & WithCreator {
  return {
    kind: "bns/update_targets_of_username",
    creator: defaultCreator,
    username: "test*iov",
    targets: [{ chainId: "barfoo" as ChainId, address: defaultAddress }],
    fee: {
      tokens: defaultAmount,
    },
  };
}

export function getCreateTextResolutionActionTransaction(): CreateProposalTx & WithCreator {
  return {
    kind: "bns/create_proposal",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    title: "Just an idea",
    description: "Try a centralized approach instead?",
    electionRuleId: 2,
    startTime: 1566383301,
    author: defaultAddress,
    action: {
      kind: ActionKind.CreateTextResolution,
      resolution: "Stop all this blockchain stuff",
    },
  };
}

export function getCreateReleaseEscrowActionTransaction(): CreateProposalTx & WithCreator {
  return {
    kind: "bns/create_proposal",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    title: "Just an idea",
    description: "Try a centralized approach instead?",
    electionRuleId: 2,
    startTime: 1566383301,
    author: defaultAddress,
    action: {
      kind: ActionKind.ReleaseEscrow,
      escrowId: 56482,
      amount: {
        quantity: "1230000000000000000", // 1.23 ETH
        fractionalDigits: 18,
        tokenTicker: "ETH" as TokenTicker,
      },
    },
  };
}

export function getCreateSendActionTransaction(): CreateProposalTx & WithCreator {
  return {
    kind: "bns/create_proposal",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    title: "Just an idea",
    description: "Try a centralized approach instead?",
    electionRuleId: 2,
    startTime: 1566383301,
    author: defaultAddress,
    action: {
      kind: ActionKind.Send,
      sender: ethereumCodec.identityToAddress(ethereumCreator),
      amount: {
        quantity: "1230000000000000000", // 1.23 ETH
        fractionalDigits: 18,
        tokenTicker: "ETH" as TokenTicker,
      },
      recipient: defaultAddress,
      memo: "paid transaction",
    },
  };
}

export function getSetValidatorsActionTransaction(): CreateProposalTx & WithCreator {
  return {
    kind: "bns/create_proposal",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    title: "Just an idea",
    description: "Try a centralized approach instead?",
    electionRuleId: 2,
    startTime: 1566383301,
    author: defaultAddress,
    action: {
      kind: ActionKind.SetValidators,
      validatorUpdates: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        ed25519_21eb1e708abfe781d0d043a47dd0b3b9c238d9b4: { power: 10 },
        // eslint-disable-next-line @typescript-eslint/camelcase
        ed25519_3d509f9aca1d01651145934e9406bc20e87d45bd: { power: 10 },
      },
    },
  };
}

export function getUpdateElectionRuleActionTransaction(): CreateProposalTx & WithCreator {
  return {
    kind: "bns/create_proposal",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    title: "Just an idea",
    description: "Try a centralized approach instead?",
    electionRuleId: 2,
    startTime: 1566383301,
    author: defaultAddress,
    action: {
      kind: ActionKind.UpdateElectionRule,
      electionRuleId: 12,
      votingPeriod: 14,
      quorum: { denominator: 2, numerator: 5 },
      threshold: { denominator: 3, numerator: 7 },
    },
  };
}

export function getUpdateElectorateActionTransaction(): CreateProposalTx & WithCreator {
  return {
    kind: "bns/create_proposal",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    title: "Just an idea",
    description: "Try a centralized approach instead?",
    electionRuleId: 2,
    startTime: 1566383301,
    author: defaultAddress,
    action: {
      kind: ActionKind.UpdateElectorate,
      electorateId: 14,
      diffElectors: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        "21eb1e708abfe781d0d043a47dd0b3b9c238d9b4": { weight: 15 },
        // eslint-disable-next-line @typescript-eslint/camelcase
        "3d509f9aca1d01651145934e9406bc20e87d45bd": { weight: 243 },
      },
    },
  };
}

export function getExecuteProposalBatchActionTransaction(): CreateProposalTx & WithCreator {
  return {
    kind: "bns/create_proposal",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    title: "Just an idea",
    description: "Try a centralized approach instead?",
    electionRuleId: 2,
    startTime: 1566383301,
    author: defaultAddress,
    action: {
      kind: ActionKind.ExecuteProposalBatch,
      messages: [
        {
          kind: ActionKind.UpdateElectionRule,
          electionRuleId: 12,
          votingPeriod: 14,
          quorum: { denominator: 2, numerator: 5 },
          threshold: { denominator: 3, numerator: 7 },
        },
        {
          kind: ActionKind.SetValidators,
          validatorUpdates: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            ed25519_21eb1e708abfe781d0d043a47dd0b3b9c238d9b4: { power: 10 },
            // eslint-disable-next-line @typescript-eslint/camelcase
            ed25519_3d509f9aca1d01651145934e9406bc20e87d45bd: { power: 10 },
          },
        },
        {
          kind: ActionKind.Send,
          sender: ethereumCodec.identityToAddress(ethereumCreator),
          amount: {
            quantity: "1230000000000000000", // 1.23 ETH
            fractionalDigits: 18,
            tokenTicker: "ETH" as TokenTicker,
          },
          recipient: defaultAddress,
          memo: "paid transaction",
        },
        {
          kind: ActionKind.ReleaseEscrow,
          escrowId: 56482,
          amount: {
            quantity: "1230000000000000000", // 1.23 ETH
            fractionalDigits: 18,
            tokenTicker: "ETH" as TokenTicker,
          },
        },
        {
          kind: ActionKind.CreateTextResolution,
          resolution: "Stop all this blockchain stuff",
        },
        {
          kind: ActionKind.UpdateElectorate,
          electorateId: 14,
          diffElectors: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            "21eb1e708abfe781d0d043a47dd0b3b9c238d9b4": { weight: 15 },
            // eslint-disable-next-line @typescript-eslint/camelcase
            "3d509f9aca1d01651145934e9406bc20e87d45bd": { weight: 243 },
          },
        },
      ],
    },
  };
}

export function getVoteTransaction(): VoteTx & WithCreator {
  return {
    kind: "bns/vote",
    creator: defaultCreator,
    fee: {
      tokens: defaultAmount,
    },
    proposalId: 666,
    selection: VoteOption.Yes,
  };
}

export const confirmAcceptButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "button");

  expect(inputs.length).toBe(5);

  const acceptButton = inputs[3];
  await click(acceptButton);
};

export const clickOnRejectButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "button");

  expect(inputs.length).toBe(5);

  const rejectButton = inputs[4];

  await click(rejectButton);

  await findRenderedDOMComponentWithId(TXRequestDom, rejectTxHtmlId);
};

export const confirmRejectButton = async (TXRequestDom: React.Component): Promise<void> => {
  const form = TestUtils.findRenderedDOMComponentWithTag(TXRequestDom, "form");
  await submit(form);
};

export const checkPermanentRejection = (TXRequestDom: React.Component): void => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "input");
  expect(inputs.length).toBe(1);

  const rejectPermanentlyCheckbox = inputs[0];
  TestUtils.act(() => {
    TestUtils.Simulate.change(rejectPermanentlyCheckbox, {
      target: { checked: true } as any,
    });
  });
};

export const clickOnBackButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "button");

  expect(inputs.length).toBe(5);

  const backButton = inputs[1];
  expect(backButton.getAttribute("aria-label")).toBe("Go back");

  TestUtils.act(() => {
    TestUtils.Simulate.click(backButton);
  });

  await findRenderedDOMComponentWithId(TXRequestDom, showTxHtmlId);
};

export const getProposalStartDate = (TXRequestDom: React.Component): string | null => {
  const values = TestUtils.scryRenderedDOMComponentsWithClass(TXRequestDom, "MuiListItemText-secondary");

  return values[2].textContent;
};
