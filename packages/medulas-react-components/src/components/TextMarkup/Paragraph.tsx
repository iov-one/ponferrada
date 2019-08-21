import * as React from "react";

import Typography from "../Typography";

interface Props {
  readonly children: React.ReactNode;
  readonly inline?: boolean;
  readonly strong?: boolean;
}

const SectionParagraph = ({ children, inline, strong }: Props): JSX.Element => (
  <Typography weight={strong ? "semibold" : "light"} variant="body2" inline={inline} gutterBottom>
    {children}
  </Typography>
);

export default SectionParagraph;
