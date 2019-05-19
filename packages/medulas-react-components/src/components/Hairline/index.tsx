import * as React from 'react';

import Block, { Unit } from '../Block';

interface Props {
  readonly space?: Unit;
  readonly color?: string;
}

const Hairline = ({ space = 0, color = 'grey.300' }: Props): JSX.Element => (
  <Block width="100%" height="1px" marginTop={space} marginBottom={space} bgcolor={color} />
);

export default Hairline;
