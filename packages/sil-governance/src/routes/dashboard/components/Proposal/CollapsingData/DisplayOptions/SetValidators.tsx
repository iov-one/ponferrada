import { SetValidatorsAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly action: SetValidatorsAction;
}

const SetValidators = ({ action }: Props): JSX.Element => {
  let validators = [];

  for (const validator in action.validatorUpdates) {
    validators.push(
      <Typography variant="body2">
        {validator} - Power {action.validatorUpdates[validator].power}
      </Typography>,
    );
  }

  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        Updates validators:
      </Typography>
      <Block marginTop={0.5}>{validators}</Block>
    </Block>
  );
};

export default SetValidators;
