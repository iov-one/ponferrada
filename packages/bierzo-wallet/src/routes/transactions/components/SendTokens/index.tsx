import { Fab, makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, CircleImage, Typography } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import { getBorderColor } from "../../../../theme/css";
import { PAYMENT_ROUTE } from "../../../paths";
import sendIcon from "../../assets/toAddressWhite.svg";

const sendTokenPadding = 20;
const sendTokensLabel = "Send tokens";

function goToPayment(): void {
  history.push(PAYMENT_ROUTE);
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "auto",
    justifyContent: "left",
    textTransform: "inherit",
  },
  sizeSmall: {
    height: `${theme.spacing(4)}px`,
    "&&": {
      padding: 0,
    },
  },
  secondary: {
    backgroundColor: "white",
    color: theme.palette.text.primary,
    padding: 0,
    boxShadow: "none",
    border: `1px solid ${getBorderColor(theme)}`,
    "&:hover": {
      background: theme.palette.background.default,
    },
  },
}));

const SendTokens = (): JSX.Element => {
  const theme = useTheme<Theme>();
  const classes = useStyles();

  const fabClasses = {
    secondary: classes.secondary,
    root: classes.root,
    sizeSmall: classes.sizeSmall,
  };
  const diameter = `${theme.spacing(4)}px`;

  return (
    <Block
      height={64}
      display="flex"
      alignItems="center"
      paddingTop={3}
      paddingBottom={3}
      paddingLeft={sendTokenPadding}
      paddingRight={sendTokenPadding}
      bgcolor="white"
    >
      <Fab
        variant="extended"
        size="small"
        color="secondary"
        aria-label={sendTokensLabel}
        classes={fabClasses}
        onClick={goToPayment}
      >
        <CircleImage
          icon={sendIcon}
          circleColor={theme.palette.primary.main}
          alt={sendTokensLabel}
          dia={diameter}
          width={16}
          height={16}
        />
        <Block paddingLeft={1.5} paddingRight={1.5}>
          <Typography variant="subtitle2" weight="regular">
            {sendTokensLabel}
          </Typography>
        </Block>
      </Fab>
    </Block>
  );
};

export default SendTokens;
