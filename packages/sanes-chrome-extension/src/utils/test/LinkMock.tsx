import * as React from 'react';
import { history } from '../../store/reducers';

interface Props {
  readonly to: string;
  readonly children: React.ReactNode;
}

const LinkMock = ({ to, children }: Props) => {
  const onClick = () => {
    history.push(to);
    return false;
  };

  return (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  );
};

export default LinkMock;
