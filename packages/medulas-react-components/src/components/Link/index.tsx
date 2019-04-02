import * as React from 'react';
//import { Link as RouterLink, LinkProps } from 'react-router-dom';

interface Props {
  readonly children: React.ReactNode;
}
//TODO: Dummy component should be replaces with Link when router will be implemented
const Link = ({ children }: Props) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default Link;
