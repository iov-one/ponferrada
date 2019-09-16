import { BlockchainState, SetBlockchainActionType } from "./reducer";

export const setBlockchainAction = (blockchain: BlockchainState): SetBlockchainActionType => ({
  type: "@@blockchain/SET",
  payload: blockchain,
});
