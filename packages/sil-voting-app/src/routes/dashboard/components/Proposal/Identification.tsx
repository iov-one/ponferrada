import { Address } from "@iov/bcp";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly id: number;
  readonly author: Address;
}

const Identification = ({ id, author }: Props): JSX.Element => {
  return (
    <Block display="flex" marginTop={1}>
      <Typography variant="body2" weight="semibold">
        ID:
      </Typography>
      <Block marginLeft={1}>
        <Typography variant="body2">{id}</Typography>
      </Block>
      <Block display="flex" marginLeft={2}>
        <Typography variant="body2" weight="semibold">
          Author:
        </Typography>
        <Block marginLeft={1}>
          <Typography variant="body2">{author}</Typography>
        </Block>
      </Block>
    </Block>
  );
};

export default Identification;
