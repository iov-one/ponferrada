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
import { ActionKind, bnsCodec, CreateProposalTx, RegisterUsernameTx, VoteOption, VoteTx } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import { ethereumCodec } from "@iov/ethereum";

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
    startTime: 1566383301091,
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
    startTime: 1566383301091,
    author: defaultAddress,
    action: {
      kind: ActionKind.ReleaseEscrow,
      escrowId: Encoding.fromHex(
        "0434ce248a6a5979c04d75d1a75907b2bec1cb4d4f6e17b76521f0925e8b6b40e00711fe98e789cf5c8317cf1e731b3101e9dbfaba5e351e424e45c9a2f4dfb63c",
      ),
      amount: {
        quantity: "1230000000000000000", // 1.23 ETH
        fractionalDigits: 18,
        tokenTicker: "ETH" as TokenTicker,
      },
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
