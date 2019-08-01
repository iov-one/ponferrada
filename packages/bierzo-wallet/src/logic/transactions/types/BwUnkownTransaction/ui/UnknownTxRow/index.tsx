import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import * as React from 'react';

import { BwUnknownProps } from '../..';

interface Props {
  readonly tx: BwUnknownProps;
}

function UnknownTxRow({ tx }: Props): JSX.Element {
  return (
    <Block display="flex" flexDirection="column" paddingLeft={3} paddingRight={3}>
      <Block margin={2} />
      <Block display="flex" alignItems="center">
        This is an UnknownTxRow
      </Block>
      <Block margin={2} />
      <Hairline />
    </Block>
  );
}

export default UnknownTxRow;
