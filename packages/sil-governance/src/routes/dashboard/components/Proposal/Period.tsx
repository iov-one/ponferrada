import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly expiryDate: Date;
  readonly startDate: Date;
  readonly hasStarted: boolean;
  readonly hasEnded: boolean;
}

const Period = ({ expiryDate, startDate, hasStarted, hasEnded }: Props): JSX.Element => {
  const expiryLabel = hasEnded ? "Expired on" : "Expires on";
  const expiryLocaleDate = expiryDate.toLocaleString();
  const startLabel = hasStarted ? "Started on" : "Starts on";
  const startLocaleDate = startDate.toLocaleString();

  return (
    <Block display="flex" alignItems="center">
      <Typography variant="body2" weight="semibold">
        {expiryLabel} {expiryLocaleDate}
      </Typography>
      <Block marginLeft={1}>
        <Typography variant="body2">
          {startLabel} {startLocaleDate}
        </Typography>
      </Block>
    </Block>
  );
};

export default Period;
