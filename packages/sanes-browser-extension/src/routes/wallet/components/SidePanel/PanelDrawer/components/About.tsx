import { Block, Image, Link, Typography } from "medulas-react-components";
import React from "react";

import neumaLogo from "../../../../assets/NeumaLogoNoText.svg";

const About = (): JSX.Element => {
  return (
    <Block marginLeft={3} marginRight={3} alignSelf="flex-start">
      <Image src={neumaLogo} alt="Logo" />
      <Typography variant="subtitle1">Neuma version</Typography>
      <Typography variant="subtitle2" color="textPrimary">
        1.0.1
      </Typography>
      <Block marginTop={6} />
      <Typography variant="subtitle1">Links</Typography>
      <Link to="https://support.iov.one/hc/en-us/requests/new?ticket_form_id=360000387040">
        <Typography variant="subtitle2" color="primary" link>
          Visit our Support Center
        </Typography>
      </Link>
    </Block>
  );
};

export default About;
