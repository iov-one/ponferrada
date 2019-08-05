import Block from "medulas-react-components/lib/components/Block";
import Typography from "medulas-react-components/lib/components/Typography";
import React from "react";

interface Props {
  readonly expiryDate: Date;
  readonly creationDate: Date;
  readonly hasEnded: boolean;
}

const Period = ({ expiryDate, creationDate, hasEnded }: Props): JSX.Element => {
  const expiryLabel = hasEnded ? "Expired on" : "Expires on";
  const expiryLocaleDate = expiryDate.toLocaleString();
  const creationLocaleDate = creationDate.toLocaleString();

  return (
    <Block display="flex" alignItems="center">
      <Typography variant="body2" weight="semibold">
        {expiryLabel} {expiryLocaleDate}
      </Typography>
      <Block marginLeft={1}>
        <Typography variant="body2">Created on {creationLocaleDate}</Typography>
      </Block>
    </Block>
  );
};

export default Period;
