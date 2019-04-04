import * as React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

interface Props extends LinkProps {
  readonly children: React.ReactNode;
}

const Link = ({ children, to, ...rest }: Props) => {
  return (
    <RouterLink to={to} {...rest}>
      {children}
    </RouterLink>
  );
};

export default Link;
