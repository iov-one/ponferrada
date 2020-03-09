import * as React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

interface Props extends LinkProps {
  readonly children: React.ReactNode;
}

const Link = ({ children, to, ...rest }: Props): JSX.Element => {
  if (typeof to === "string") {
    if (/^((mailto:)|((https?:)?\/\/))/.test(to)) {
      // We use href and target in the <a> tag for styling and hover efects.
      // The actual click event is handled via JavaScript to allow testing those clicks
      const clickHandler = (event: React.MouseEvent): void => {
        window.open(to, "_blank");
        event.preventDefault();
      };
      return (
        <a href={to} target="_blank" onClick={clickHandler} rel="noopener noreferrer">
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
