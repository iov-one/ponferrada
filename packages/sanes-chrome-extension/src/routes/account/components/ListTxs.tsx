import { Amount } from '@iov/bcp';
import * as React from 'react';
import { ReadonlyDate } from 'readonly-date';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Typography from 'medulas-react-components/lib/components/Typography';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import upToDate from '../assets/uptodate.svg';
import Tx from './Tx';
import EmptyList from './Empty';

interface TxProps {
  readonly id: string;
  readonly recipient: string;
  readonly signer: string;
  readonly amount: Amount;
  readonly memo?: string;
}

export interface ProcessedTx extends TxProps {
  readonly time: ReadonlyDate;
  readonly received: boolean;
  readonly success: boolean;
  readonly err?: any; // eslint-disable-line
}

interface Props {
  readonly txs: ReadonlyArray<ProcessedTx>;
  readonly title: string;
}

const ListTxs = ({ txs, title }: Props): JSX.Element => {
  const hasItems = txs.length > 0;

  return (
    <List component="nav">
      <Block>
        <ListItem>
          <ListItemText disableTypography>
            <Typography variant="body1">{title}</Typography>
          </ListItemText>
        </ListItem>
      </Block>
      <Hairline />
      {hasItems ? (
        txs.map((tx: ProcessedTx, index: number) => {
          const lastOne = index + 1 === txs.length;

          return <Tx key={tx.id} item={tx} lastOne={lastOne} />;
        })
      ) : (
        <EmptyList src={upToDate} alt={`No ${title}`} text={`No ${title}`} />
      )}
    </List>
  );
};

export default ListTxs;
