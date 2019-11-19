import { Block, Image, Link, Typography } from "medulas-react-components";
import React from "react";

import version from "../../../../../../version";
import { SUPPORT_CENTER_URL } from "../../../../../paths";
import neumaLogo from "../../../../assets/NeumaLogoNoText.svg";

const About = (): JSX.Element => {
  return (
    <Block marginLeft={3} marginRight={3} alignSelf="flex-start">
      <Image src={neumaLogo} alt="Logo" />
      <Typography variant="subtitle1">Neuma version</Typography>
      <Typography variant="subtitle2" color="textPrimary">
        {version}
      </Typography>
      <Block marginTop={6} />
      <Typography variant="subtitle1">Links</Typography>
      <Link to={SUPPORT_CENTER_URL}>
        <Typography variant="subtitle2" color="primary" link>
          Visit our Support Center
        </Typography>
      </Link>
    </Block>
  );
};

export default About;
