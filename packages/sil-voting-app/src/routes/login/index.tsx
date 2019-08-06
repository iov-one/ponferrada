import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Block from "medulas-react-components/lib/components/Block";
import Button from "medulas-react-components/lib/components/Button";
import Form, { useForm } from "medulas-react-components/lib/components/forms/Form";
import CircleImage from "medulas-react-components/lib/components/Image/CircleImage";
import Typography from "medulas-react-components/lib/components/Typography";
import { ToastContext } from "medulas-react-components/lib/context/ToastProvider";
import { ToastVariant } from "medulas-react-components/lib/context/ToastProvider/Toast";
import React, { useContext } from "react";
import * as ReactRedux from "react-redux";

import icon from "../../assets/iov-logo.svg";
import { getExtensionStatus, setExtensionStateAction } from "../../store/extension";
import { addProposalsAction, getProposals } from "../../store/proposals";
import { history } from "../index";
import { DASHBOARD_ROUTE } from "../paths";

export const INSTALL_EXTENSION_MSG = "You need to install IOV extension.";
export const LOGIN_EXTENSION_MSG = "Please login to the IOV extension to continue.";

const useStyles = makeStyles((theme: Theme) => ({
  login: {
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
    padding: "50px",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Login = (): JSX.Element => {
  const classes = useStyles();
  const toast = useContext(ToastContext);
  //TODO: Fix this as soon as proper react-redux definitions will be available
  const dispatch = (ReactRedux as any).useDispatch();

  const isExtensionConnected = async (): Promise<boolean> => {
    const result = await getExtensionStatus();
    dispatch(setExtensionStateAction(result.connected, result.installed, result.identity));

    if (!result.installed) {
      toast.show(INSTALL_EXTENSION_MSG, ToastVariant.ERROR);
      return false;
    }

    if (!result.connected) {
      toast.show(LOGIN_EXTENSION_MSG, ToastVariant.ERROR);
      return false;
    }

    return true;
  };

  const loadProposals = async (): Promise<void> => {
    const chainProposals = await getProposals();
    dispatch(addProposalsAction(chainProposals));
  };

  const onLogin = async (): Promise<void> => {
    if (await isExtensionConnected()) {
      await loadProposals();
      history.push(DASHBOARD_ROUTE);
    }
  };

  const { handleSubmit, submitting } = useForm({
    onSubmit: onLogin,
  });

  return (
    <Block
      width="100vw"
      height="auto"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.login}
    >
      <CircleImage alt="Logo" icon={icon} dia="200px" iconClasses={classes.icon} />
      <Block marginTop={5} marginBottom={5}>
        <Typography variant="h6">IOV Voting Dashboard</Typography>
      </Block>
      <Form onSubmit={handleSubmit}>
        <Button className={classes.button} type="submit" disabled={submitting}>
          LOG IN
        </Button>
      </Form>
    </Block>
  );
};

export default Login;
