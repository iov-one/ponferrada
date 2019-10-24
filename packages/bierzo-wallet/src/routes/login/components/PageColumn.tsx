import { makeStyles, Theme } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import useTheme from "@material-ui/styles/useTheme";
import { Block, Button, Image, Typography } from "medulas-react-components";
import React from "react";

import ledgerIcon from "../assets/ledger.svg";
import neumaIcon from "../assets/neuma.svg";
import neumaWalletLogo from "../assets/neumaWalletLogo.svg";
import SubtitleSection from "./SubtitleSection";
import TitleSection from "./TitleSection";

interface Props {
  readonly onLoginWithNeuma: () => void;
  readonly onLoginWithLedger: () => void;
  readonly onGetNeumaExtension: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  rect1: {
    opacity: 0.4,
    transform: "rotate(165deg)",
  },
  rect2: {
    transform: "rotate(165deg)",
  },
  rect3: {
    transform: "rotate(-60deg)",
  },
  secondaryNext: {
    padding: "0.5em",
  },
  contentBorder: {
    boxSizing: "border-box",
    boxShadow: "0px 2px 8px rgba(237, 239, 244, 0.5)",
    borderRadius: 5,
  },
}));

function NeumaIcon(): JSX.Element {
  return <Image src={neumaIcon} alt="Neuma login icon" />;
}

function LedgerIcon(): JSX.Element {
  return <Image src={ledgerIcon} alt="Ledger login icon" />;
}

const PageColumn = ({ onLoginWithNeuma, onLoginWithLedger, onGetNeumaExtension }: Props): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  return (
    <Block
      display="flex"
      flexGrow={1}
      flexShrink={1}
      flexDirection="row"
      flexWrap="wrap"
      height="100vh"
      bgcolor={theme.palette.background.paper}
    >
      <Block
        width={420}
        minHeight={500}
        bgcolor="#F5F7F9"
        position="relative"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Block
          position="absolute"
          bgcolor="#E6F1F1"
          width={330}
          height={330}
          left={-190}
          top={-95}
          borderRadius={30}
          className={classes.rect2}
        ></Block>
        <Block
          position="absolute"
          bgcolor="#5BB8A8"
          width={330}
          height={330}
          left={-235}
          top={-120}
          borderRadius={30}
          className={classes.rect1}
        ></Block>
        <Block
          position="absolute"
          bgcolor="#E6F1F1"
          width={390}
          height={390}
          bottom={-300}
          right={-140}
          borderRadius={30}
          className={classes.rect3}
        ></Block>
        <Image src={neumaWalletLogo} alt="Neuma logo" />
      </Block>
      <Block flexGrow={1} display="flex" alignItems="center" justifyContent="center">
        <Block
          width={562}
          border="1px solid #F3F3F3"
          className={classes.contentBorder}
          padding={5}
          textAlign="center"
        >
          <TitleSection primaryTitle="Welcome" secondaryTitle="to your Neuma wallet" />
          <SubtitleSection>
            To access the wallet please authenticate using Neuma or Ledger Nano S
          </SubtitleSection>
          <Block marginBottom={2}>
            <Button fullWidth onClick={onLoginWithNeuma} startIcon={<NeumaIcon />}>
              Continue with Neuma Browser Extension
            </Button>
          </Block>
          <Block marginBottom={4}>
            <Button fullWidth color="inverted" onClick={onLoginWithLedger} startIcon={<LedgerIcon />}>
              Continue with Ledger Nano S
            </Button>
          </Block>
          <Block marginBottom={5}>
            <Typography variant="body1" weight="light" color="textPrimary">
              or, in case you don’t have the extension
            </Typography>
          </Block>
          <Button
            fullWidth
            variant="text"
            onClick={onGetNeumaExtension}
            endIcon={<ArrowForwardIcon fontSize="small" />}
          >
            Get Neuma Browser Extension
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default PageColumn;
