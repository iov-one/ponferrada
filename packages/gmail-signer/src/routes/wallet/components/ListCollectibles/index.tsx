import { Block, Hairline, List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import noCollectiblesIcon from "../../assets/noCollectibles.svg";
import EmptyList from "../EmptyList";
import ListContent from "./ListContent";

const listTitle = "Collectibles";
const noCollectiblesText = "No collectibles yet";
const noCollectiblesSubText = "Register your first starname and it will appear here.";

const useStyles = makeStyles({
  boxBorder: {
    border: "none",
  },
});

interface Props {
  readonly starnames: readonly string[];
  readonly awards: readonly string[];
}

const ListCollectibles = ({ starnames, awards }: Props): JSX.Element => {
  const classes = useStyles();

  const hasStarnames = starnames.length > 0;
  const hasAwards = awards.length > 0;
  const isListEmpty = !hasStarnames && !hasAwards;

  return (
    <List component="nav" className={classes.boxBorder}>
      <Block marginLeft={1} marginRight={1}>
        <ListItem>
          <Typography variant="body1">{listTitle}</Typography>
        </ListItem>
      </Block>
      <Hairline color="#f3f3f3" />
      <ListContent starnames={starnames} awards={awards} />
      {isListEmpty && (
        <EmptyList
          src={noCollectiblesIcon}
          alt={`No ${listTitle}`}
          text={noCollectiblesText}
          subText={noCollectiblesSubText}
        />
      )}
    </List>
  );
};

export default ListCollectibles;
