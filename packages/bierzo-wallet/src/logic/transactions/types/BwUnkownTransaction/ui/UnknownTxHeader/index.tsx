import ListItem from '@material-ui/core/ListItem';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import * as React from 'react';

import { BwUnknownProps } from '../..';

interface Props {
  readonly tx: BwUnknownProps;
  readonly lastOne: boolean;
}

const UnknownTxHeader = ({ tx, lastOne }: Props): JSX.Element => {
  return (
    <Block padding={1}>
      <ListItem>
        <Block paddingLeft={2}>This is an UnknownTxHeader</Block>
      </ListItem>
      {!lastOne && (
        <Block padding="md">
          <Hairline />
        </Block>
      )}
    </Block>
  );
};

export default UnknownTxHeader;
