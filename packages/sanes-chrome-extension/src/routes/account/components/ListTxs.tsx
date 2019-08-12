import { Block, Hairline, List, ListItem, ListItemText, Typography } from "medulas-react-components";
import * as React from "react";

import { ProcessedTx } from "../../../extension/background/model/persona";
import upToDate from "../assets/uptodate.svg";
import EmptyList from "./Empty";
import Tx from "./Tx";

interface Props {
  readonly txs: readonly ProcessedTx[];
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
