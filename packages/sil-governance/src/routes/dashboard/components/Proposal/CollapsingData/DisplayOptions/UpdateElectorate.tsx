import { UpdateElectorateAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly action: UpdateElectorateAction;
}

const UpdateElectorate = ({ action }: Props): JSX.Element => {
  const electors = Object.entries(action.diffElectors).map(([elector, props]) => {
    return (
      <Block marginTop={0.5} marginBottom={1}>
        <Typography variant="body2">
          {elector} - Weight {props.weight}
        </Typography>
      </Block>
    );
  });

  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        Updates electorate {action.electorateId}:
      </Typography>
      <Block marginTop={0.5}>{electors}</Block>
    </Block>
  );
};

export default UpdateElectorate;
