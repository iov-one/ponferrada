import { CreateTextResolutionAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly action: CreateTextResolutionAction;
}

const CreateTextResolution = ({ action }: Props): JSX.Element => {
  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        Resolution:
      </Typography>
      <Block marginTop={0.5}>
        <Typography variant="body2">{action.resolution}</Typography>
      </Block>
    </Block>
  );
};

export default CreateTextResolution;
