import { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';

import { ProcessedTx } from '../../../../store/notifications';
import fromAddress from '../../assets/fromAddress.svg';
import toAddress from '../../assets/toAddress.svg';
import { SortingStateProps } from '../sorting';

export interface TxTableProps extends SortingStateProps {
  readonly rows: readonly JSX.Element[];
  readonly onChangeRows: (item: Item) => void;
  readonly onPrevPage: () => void;
  readonly onNextPage: () => void;
}

export function getTypeIcon(tx: ProcessedTx): string {
  return tx.received ? fromAddress : toAddress;
}

export function getAddressPrefix(tx: ProcessedTx): string {
  if (tx.received) {
    return 'From';
  } else {
    return 'To';
  }
}

export const DEFAULT_ADDRESS = 'blockchain address';
