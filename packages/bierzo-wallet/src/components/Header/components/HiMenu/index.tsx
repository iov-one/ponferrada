import { makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Block, Hairline, Image, ListMenu, Typography } from "medulas-react-components";
import * as React from "react";
import * as ReactRedux from "react-redux";

import { disconnect } from "../../../../logic/connection";
import { history } from "../../../../routes";
import { POLICY_ROUTE, TERMS_ROUTE, UPGRADE_ROUTE } from "../../../../routes/paths";
import { resetAppAction } from "../../../../store";
import { getBorderColor } from "../../../../theme/css";
import chevronDown from "../../assets/chevronDown.svg";
import chevronUp from "../../assets/chevronUp.svg";
import logout from "../../assets/logout.svg";
import privacy from "../../assets/privacyPolicy.svg";
import terms from "../../assets/terms.svg";
import account from "../../assets/account.svg";

export const TERMS_CONDITIONS_ID = "terms";
export const PRIVACY_POLICY_ID = "privacy-policy";
export const LOG_OUT_ID = "log-out";
export const UPGRADE_ID = "upgrade";

export const MENU_ID = "hi-menu";

interface HiElementProps {
  readonly src: string;
  readonly alt: string;
  readonly msg: string;
  readonly id: string;
  readonly action: () => void;
  readonly height?: string;
}

const HiElement = ({ src, alt, id, action, msg, height = "18" }: HiElementProps): JSX.Element => {
  const ItemIcon = (): JSX.Element => (
    <ListItemIcon>
      <Image src={src} alt={alt} height={height} />
    </ListItemIcon>
  );

  return (
    <ListItem id={id} disableGutters button onClick={action}>
      <ItemIcon />
      <ListItemText disableTypography>
        <Typography variant="body2">{msg}</Typography>
      </ListItemText>
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  chevron: {
    padding: `${theme.spacing(1)}px`,
  },
  separator: {
    height: "30px",
    paddingRight: `${theme.spacing(4)}px`,
    borderLeft: `1px solid ${getBorderColor(theme)}`,
  },
}));

const onTerms = (): void => {
  history.push(TERMS_ROUTE);
};

const onPolicy = (): void => {
  history.push(POLICY_ROUTE);
};

const onUpgrade = (): void => {
  history.push(UPGRADE_ROUTE);
};

const HiMenu = (props: {}): JSX.Element => {
  const classes = useStyles();
  const dispatch = ReactRedux.useDispatch();
  const { ...rest } = props;

  const onLogout = (): void => {
    disconnect();
    dispatch(resetAppAction());
  };

  const starter = (open: boolean): JSX.Element => (
    <Block className={classes.root}>
      <Typography variant="h6">Hi!</Typography>
      <IconButton disableRipple>
        <Image src={open ? chevronUp : chevronDown} alt="Open" />
      </IconButton>
    </Block>
  );

  return (
    <ListMenu starter={starter} listWidth={280} listId={MENU_ID} {...rest}>
      <Block paddingLeft={2} paddingRight={2} paddingBottom={1} paddingTop={1}>
        <HiElement src={account} id={UPGRADE_ID} action={onUpgrade} msg="Upgrade My Account" alt="About" />
        <Hairline />
        <HiElement
          src={terms}
          id={TERMS_CONDITIONS_ID}
          action={onTerms}
          msg="Terms & Conditions"
          alt="Terms & Conditions"
        />
        <Hairline />
        <HiElement
          src={privacy}
          id={PRIVACY_POLICY_ID}
          action={onPolicy}
          msg="Privacy Policy"
          alt="Privacy Policy"
        />
        <Hairline />
        <HiElement src={logout} id={LOG_OUT_ID} action={onLogout} msg="Logout" alt="Logout" />
      </Block>
    </ListMenu>
  );
};

export default HiMenu;
