import { makeStyles, Theme } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import React from "react";

import { Tally } from "../../../../store/proposals";
import { STATUS_BACKGROUND, STATUS_BORDER } from "../../../../theme/css";

const useStyles = makeStyles((theme: Theme) => ({
  status: {
    border: `1px solid ${STATUS_BORDER}`,
    borderRadius: theme.spacing(2),
  },
  winnerBar: {
    borderRadius: theme.spacing(2),
  },
}));

interface Props {
  readonly tally: Tally;
}

const getYesPercentage = (tally: Tally): string => {
  let yesPercentage = "0%";

  if (tally.yes) {
    yesPercentage = Math.floor((tally.yes / tally.totalVotes) * 100) + "%";
  }

  return yesPercentage;
};

const TallyBar = ({ tally }: Props): JSX.Element => {
  const classes = useStyles();

  const yesPercentage = getYesPercentage(tally);

  return (
    <Block width="100%" className={classes.status} marginTop={2}>
      <Block
        padding={1}
        bgcolor={STATUS_BACKGROUND}
        width={yesPercentage}
        minWidth="15%"
        className={classes.winnerBar}
      >
        <Typography variant="body2">{yesPercentage} Yes</Typography>
      </Block>
    </Block>
  );
};

export default TallyBar;
