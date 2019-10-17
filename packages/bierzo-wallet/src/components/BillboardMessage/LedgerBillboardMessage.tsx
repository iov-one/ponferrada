import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import ledger from "./assets/ledger.svg";
import { BillboardMessageProps } from "./index";

const useStyles = makeStyles({
  panel: {
    border: "1px solid #F3F3F3",
    boxSizing: "border-box",
    borderRadius: 5,
  },
});

function LedgerBillboardMessage({ text }: BillboardMessageProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  return (
    <Block
      bgcolor={theme.palette.background.paper}
      marginTop={5}
      marginRight={15}
      width={450}
      height={250}
      padding={8}
      paddingTop={9}
      textAlign="center"
      className={classes.panel}
    >
      <Image src={ledger} alt="ledger" />

      <Block marginTop={4}>
        <Typography variant="body1" align="center" weight="semibold">
          {text}
        </Typography>
      </Block>
    </Block>
  );
}

export default LedgerBillboardMessage;
