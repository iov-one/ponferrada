import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import arrowBody from "./assets/arrow-body.svg";
import arrowHead from "./assets/arrow-head.svg";
import logoZoom from "./assets/logo-zoom.svg";
import toolbar from "./assets/toolbar.png";
import zoom from "./assets/zoom.png";
import { BillboardMessageProps } from "./index";

const useStyles = makeStyles({
  panel: {
    border: "1px solid #F3F3F3",
    boxSizing: "border-box",
    borderRadius: 5,
  },
  toolbar: {
    position: "absolute",
    top: 20,
    left: 7,
  },
  zoom: {
    position: "absolute",
    right: 0,
  },
  logoZoom: {
    position: "absolute",
    top: 34,
    right: 34,
  },
  count: {
    fontSize: "1.6rem",
    fontWeight: 600,
    lineHeight: "20px",
  },
  arrowHead: {
    position: "absolute",
    top: 7,
    right: 35,
  },
  arrowBody: {
    position: "absolute",
    bottom: 0,
  },
});

function NeumaBillboardMessage({ text }: BillboardMessageProps): React.ReactElement {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  return (
    <Block
      bgcolor={theme.palette.background.paper}
      marginTop={5}
      marginRight={15}
      width={450}
      height={350}
      padding={8}
      paddingTop={12}
      className={classes.panel}
    >
      <Block marginBottom={2} position="relative" height={94}>
        <Image src={toolbar} alt="toolbar" className={classes.toolbar} />
        <Image src={zoom} alt="zoom" className={classes.zoom} />
        <Image src={logoZoom} alt="logoZoom" className={classes.logoZoom} />
        <Block
          position="absolute"
          bgcolor="#5086EC"
          height={22}
          width={22}
          bottom={23}
          right={23}
          textAlign="center"
          color="white"
          border="1px solid #333639"
          borderRadius={4}
          fontSize="1.6rem"
          fontWeight={600}
          lineHeight="20px"
        >
          1
        </Block>
        <Block position="absolute" top={-70} right={-70} width={90} height={100}>
          <Image src={arrowHead} width={20} height={20} alt="arrow" className={classes.arrowHead} />
          <Image src={arrowBody} width={80} height={83} alt="arrow" className={classes.arrowBody} />
        </Block>
      </Block>

      <Typography variant="body1" align="center" weight="semibold" gutterBottom>
        {text}
      </Typography>
      <Typography variant="body2" align="center" color="textPrimary">
        Use the Neuma Browser Extension located in the Browser menu in order to authorize your request.
      </Typography>
    </Block>
  );
}

export default NeumaBillboardMessage;
