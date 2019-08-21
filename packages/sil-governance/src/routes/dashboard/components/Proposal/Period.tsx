import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly expiryDate: Date;
  readonly startDate: Date;
  readonly hasEnded: boolean;
}

const Period = ({ expiryDate, startDate, hasEnded }: Props): JSX.Element => {
  const expiryLabel = hasEnded ? "Expired on" : "Expires on";
  const expiryLocaleDate = expiryDate.toLocaleString();
  const startLocaleDate = startDate.toLocaleString();

  return (
    <Block display="flex" alignItems="center">
      <Typography variant="body2" weight="semibold">
        {expiryLabel} {expiryLocaleDate}
      </Typography>
      <Block marginLeft={1}>
        <Typography variant="body2">Created on {startLocaleDate}</Typography>
      </Block>
    </Block>
  );
};

export default Period;
