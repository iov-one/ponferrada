import { Typography } from "medulas-react-components";
import * as React from "react";

interface Props {
  readonly primaryTitle: string;
  readonly secondaryTitle: string;
}

const TitleSection = ({ primaryTitle, secondaryTitle }: Props): JSX.Element => (
  <React.Fragment>
    <Typography variant="h4" color="primary" inline>
      Neuma Wallet is now closed.
    </Typography>

    <br />
    <br />
    <Typography variant="h4" inline>
      <a href="https://wallet.cosmostation.io/">You can now use Cosmostation Wallet.</a>
    </Typography>
  </React.Fragment>
);

export default TitleSection;
