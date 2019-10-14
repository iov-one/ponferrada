import { Typography } from "medulas-react-components";
import * as React from "react";

interface Props {
  readonly primaryTitle: string;
  readonly secondaryTitle: string;
}

const TitleSection = ({ primaryTitle, secondaryTitle }: Props): JSX.Element => (
  <React.Fragment>
    <Typography variant="h4" color="primary" inline>
      {`${primaryTitle} `}
    </Typography>
    <Typography variant="h4" inline>
      {secondaryTitle}
    </Typography>
  </React.Fragment>
);

export default TitleSection;
