import { SelectFieldItem } from "medulas-react-components";

import { ProcessedSendTransaction } from "../../../../store/notifications";
import { SortingStateProps } from "../sorting";

export interface TxTableProps extends SortingStateProps {
  readonly rows: readonly JSX.Element[];
  readonly onChangeRows: (item: SelectFieldItem | undefined) => void;
  readonly onPrevPage: () => void;
  readonly onNextPage: () => void;
}

export function getAddressPrefix(tx: ProcessedSendTransaction): string {
  if (tx.outgoing) return "To";
  else return "From";
}

export const DEFAULT_ADDRESS = "blockchain address";
