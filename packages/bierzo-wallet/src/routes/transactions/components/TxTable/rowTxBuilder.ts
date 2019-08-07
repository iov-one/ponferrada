import { Item } from "medulas-react-components/lib/components/forms/SelectFieldForm";

import { ProcessedSendTransaction } from "../../../../store/notifications";
import fromAddress from "../../assets/fromAddress.svg";
import toAddress from "../../assets/toAddress.svg";
import { SortingStateProps } from "../sorting";

export interface TxTableProps extends SortingStateProps {
  readonly rows: readonly JSX.Element[];
  readonly onChangeRows: (item: Item) => void;
  readonly onPrevPage: () => void;
  readonly onNextPage: () => void;
}

export function getTypeIcon(tx: ProcessedSendTransaction): string {
  return tx.outgoing ? toAddress : fromAddress;
}

export function getAddressPrefix(tx: ProcessedSendTransaction): string {
  if (tx.outgoing) return "To";
  else return "From";
}

export const DEFAULT_ADDRESS = "blockchain address";
