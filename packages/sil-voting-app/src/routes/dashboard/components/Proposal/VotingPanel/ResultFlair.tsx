import { ProposalResult } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly result: ProposalResult;
}

const ResultFlair = ({ result }: Props): JSX.Element => {
  const resultLabel = ProposalResult[result].toUpperCase();

  return (
    <Block marginBottom={2}>
      <Typography variant="body2">PROPOSAL {resultLabel}</Typography>
    </Block>
  );
};

export default ResultFlair;
