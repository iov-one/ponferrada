import * as React from "react";

import Block from "../Block";
import Typography from "../Typography";

interface Props {
  readonly children: React.ReactNode;
  readonly variant?: "h5" | "h6";
}

const TitleComponent = ({ children, variant = "h6" }: Props): JSX.Element => (
  <React.Fragment>
    <Block margin={2} />
    <Typography variant={variant}>{children}</Typography>
    <Block margin={2} />
  </React.Fragment>
);

export default TitleComponent;
