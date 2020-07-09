import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Typography } from "medulas-react-components";
import React from "react";

import { REGISTER_STARNAME_LINK } from "..";
import { NoStarnameHeader } from "routes/account/register/components/StarnameForm/noStarnameHeader";

interface Props {
  readonly onRegisterStarname: () => void;
}

export function GetYourAddress({ onRegisterStarname }: Props): JSX.Element {
  return (
    <Block display="flex" flexDirection="column" alignItems="center">
      <NoStarnameHeader />
      <Block marginTop={3} />
      <Typography variant="subtitle1" weight="semibold" gutterBottom>
        Register your starname
      </Typography>
      <Typography variant="body2" color="textPrimary">
        A starname is your universal username for the blockchain world. It enables you to receive
        crypto-currencies or to log in to blockchain applications in a seamless way. Transferring value
        becomes fast an easy.
      </Typography>
      <Block marginTop={3} />
      <Typography
        id={REGISTER_STARNAME_LINK}
        variant="subtitle1"
        color="primary"
        weight="semibold"
        inline
        link
        onClick={onRegisterStarname}
      >
        Register Now
      </Typography>
    </Block>
  );
}

function StarnamesNotExists({ onRegisterStarname }: Props): JSX.Element {
  const theme = useTheme<Theme>();

  return (
    <Block
      width={450}
      bgcolor={theme.palette.background.paper}
      padding={5}
      display="flex"
      flexDirection="column"
      borderRadius={5}
      textAlign="center"
      border="1px solid #F3F3F3"
    >
      <GetYourAddress onRegisterStarname={onRegisterStarname} />
    </Block>
  );
}

export default StarnamesNotExists;
