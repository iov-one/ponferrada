import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import { ReadonlyDate } from 'readonly-date';

interface Props {
  readonly author: string;
  readonly id: string;
  readonly creationDate: Date;
}

const CreationData = ({ author, id, creationDate }: Props): JSX.Element => {
  const localeDate = (creationDate as ReadonlyDate).toLocaleString();

  return (
    <Block display="flex" alignItems="center" marginBottom={1}>
      <Typography variant="body1">Author: {author}</Typography>
      <Block marginLeft={2}>
        <Typography variant="body1">Proposal ID: {id}</Typography>
      </Block>
      <Block marginLeft={2}>
        <Typography variant="body1">Created on {localeDate}</Typography>
      </Block>
    </Block>
  );
};

export default CreationData;
