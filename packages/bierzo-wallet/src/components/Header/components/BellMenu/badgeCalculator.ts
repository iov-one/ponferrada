import { ProcessedTx } from '../../../../store/notifications';

export interface BadgeProps {
  readonly invisible: boolean;
  readonly color: 'default' | 'primary' | 'error';
}

export const hiddenBadge: BadgeProps = {
  invisible: true,
  color: 'default',
};

const buildBadgeFrom = (lastTxSucceded: boolean): BadgeProps => ({
  invisible: false,
  color: lastTxSucceded ? 'primary' : 'error',
});

const lastTxNewer = (lastTx: ProcessedTx, lastStoredTx: ProcessedTx): boolean => {
  return lastTx.time.getTime() > lastStoredTx.time.getTime();
};

export const calcBadgeProps = (
  lastTx: ProcessedTx | undefined,
  lastStoredTx: ProcessedTx | undefined,
): BadgeProps => {
  if (!lastTx) {
    return hiddenBadge;
  }

  if (!lastStoredTx) {
    return buildBadgeFrom(lastTx.success);
  }

  const isLastTxNewer = lastTxNewer(lastTx, lastStoredTx);
  if (isLastTxNewer) {
    return buildBadgeFrom(lastTx.success);
  }

  if (lastTx.id !== lastStoredTx.id) {
    return buildBadgeFrom(lastTx.success);
  }

  return hiddenBadge;
};
