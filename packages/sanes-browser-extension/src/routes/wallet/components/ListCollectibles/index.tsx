import { Block, Hairline, List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import { history } from "../../../../utils/history";
import { COLLECTIBLES_ROUTE } from "../../../paths";
import awardIcon from "../../assets/award.svg";
import noCollectiblesIcon from "../../assets/noCollectibles.svg";
import starnameIcon from "../../assets/starname.svg";
import EmptyList from "../EmptyList";
import CollectibleItem from "./CollectibleItem";

const listTitle = "Collectibles";
const noCollectiblesText = "No collectibles yet";
const noCollectiblesSubText = "Register your first starname and it will appear here.";
const starnamesTitle = "Starnames";
const awardsTitle = "Awards";

const useStyles = makeStyles({
  boxBorder: {
    border: "none",
  },
});

interface Props {
  readonly starnames: string[];
  readonly awards: string[];
}

const ListCollectibles = ({ starnames, awards }: Props): JSX.Element => {
  const classes = useStyles();

  const goToStarnames = (): void => {
    history.push({
      pathname: COLLECTIBLES_ROUTE,
      state: {
        type: "Starnames",
        icon: starnameIcon,
        collectibles: starnames,
      },
    });
  };

  const goToAwards = (): void => {
    history.push({
      pathname: COLLECTIBLES_ROUTE,
      state: {
        type: "Awards",
        icon: awardIcon,
        collectibles: awards,
      },
    });
  };

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
      {hasStarnames && (
        <CollectibleItem
          onClick={goToStarnames}
          icon={starnameIcon}
          title={starnamesTitle}
          numItems={starnames.length}
        />
      )}
      {hasStarnames && hasAwards && (
        <Block marginLeft={3}>
          <Hairline color="#f3f3f3" />
        </Block>
      )}
      {hasAwards && (
        <CollectibleItem onClick={goToAwards} icon={awardIcon} title={awardsTitle} numItems={awards.length} />
      )}
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
