import { makeStyles, Theme } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import useTheme from "@material-ui/styles/useTheme";
import { FormApi } from "final-form";
import React from "react";

import Block from "../../components/Block";
import BoxScroll from "../../components/BoxScroll";
import Button from "../../components/Button";
import Form, { useForm } from "../../components/forms/Form";
import Hairline from "../../components/Hairline";
import Img from "../../components/Image";
import Typography from "../../components/Typography";
import logo from "../../theme/assets/pageColumn/logo.svg";
import logoBlack from "../../theme/assets/pageColumn/logoBlack.svg";
import people from "../../theme/assets/pageColumn/People.svg";
import SubtitleSection from "./SubtitleSection";
import TitleSection from "./TitleSection";

interface Props {
  readonly icon: "white" | "black";
  readonly primaryNextLabel: string;
  readonly primaryNextClicked: (values: object) => void;
  readonly secondaryNextLabel?: string;
  readonly secondaryNextClicked?: () => void;
  readonly formRender?: (form: FormApi) => JSX.Element;
  readonly validation?: (values: object) => object | Promise<object>;

  readonly primaryTitle: string;
  readonly secondaryTitle: string;
  readonly subtitle: string;

  readonly renderHeader?: () => JSX.Element;
}

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    bottom: "80px",
    position: "relative",
    display: "flex",
    margin: "0 auto",
  },
  secondaryNext: {
    padding: "0.5em",
  },
  contentBorder: {
    background: theme.palette.background.paper,
    boxSizing: "border-box",
    boxShadow: "0px 2px 8px rgba(237, 239, 244, 0.5)",
    borderRadius: 5,
  },
}));

const PageColumn = ({
  formRender,
  icon,
  primaryTitle,
  secondaryTitle,
  subtitle,
  primaryNextLabel,
  primaryNextClicked,
  secondaryNextLabel,
  secondaryNextClicked,
  renderHeader,
}: Props): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const { form, handleSubmit, submitting, invalid, validating } = useForm({
    onSubmit: primaryNextClicked,
  });

  return (
    <Block
      display="flex"
      flexGrow={1}
      flexShrink={1}
      flexDirection="row"
      flexWrap="wrap"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Block width={420} bgcolor="black"></Block>
      <Block flexGrow={1} display="flex" alignItems="center" justifyContent="center">
        <Block
          width={562}
          border="1px solid black"
          className={classes.contentBorder}
          padding={5}
          textAlign="center"
        >
          <Form onSubmit={handleSubmit}>
            <TitleSection primaryTitle={primaryTitle} secondaryTitle={secondaryTitle} />
            <SubtitleSection text={subtitle} />
            <Button fullWidth type="submit" disabled={invalid || submitting} startIcon={<DeleteIcon />}>
              Continue with Neuma Browser Extension
            </Button>
            <Button fullWidth type="submit" disabled={invalid || submitting}>
              Continue with Ledger Nano S
            </Button>
          </Form>
        </Block>
      </Block>
    </Block>
  );
};

export default PageColumn;
