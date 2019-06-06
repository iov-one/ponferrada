import * as React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

interface Props extends LinkProps {
  readonly children: React.ReactNode;
}

const Link = ({ children, to, ...rest }: Props): JSX.Element => {
  if (typeof to === 'string') {
    if (/^((mailto:)|((https?:)?\/\/))/.test(to)) {
      return (
        <a href={to} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
  }

  return (
    <RouterLink to={to} {...rest}>
      {children}
    </RouterLink>
  );
};

export default Link;
