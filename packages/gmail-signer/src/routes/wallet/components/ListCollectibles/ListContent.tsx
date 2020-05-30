import { Block, Hairline } from "medulas-react-components";
import * as React from "react";

import { history } from "../../../../utils/history";
import { COLLECTIBLES_ROUTE } from "../../../paths";
import awardIcon from "../../assets/award.svg";
import starnameIcon from "../../assets/starname.svg";
import CollectibleItem from "./CollectibleItem";

const starnamesTitle = "Starnames";
const awardsTitle = "Awards";

interface Props {
  readonly starnames: readonly string[];
  readonly awards: readonly string[];
}

const ListContent = ({ starnames, awards }: Props): JSX.Element => {
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

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default ListContent;
