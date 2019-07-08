import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

interface Props {
  readonly author: string;
  readonly id: string;
  readonly creationDate: Date;
}

const CreationData = (props: Props): JSX.Element => {
  return (
    <Block display="flex" alignItems="center" marginBottom={1}>
      <Typography variant="body1">Author: {props.author}</Typography>
      <Block marginLeft={2}>
        <Typography variant="body1">Proposal ID: {props.id}</Typography>
      </Block>
      <Block marginLeft={2}>
        <Typography variant="body1">Created on {props.creationDate.toLocaleDateString('en-EN')}</Typography>
      </Block>
    </Block>
  );
};

export default CreationData;
