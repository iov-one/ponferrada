import { ProposalResult } from "@iov/bns";
import Block from "medulas-react-components/lib/components/Block";
import Typography from "medulas-react-components/lib/components/Typography";
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
