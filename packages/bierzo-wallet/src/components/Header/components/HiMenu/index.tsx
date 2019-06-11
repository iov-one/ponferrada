import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import { LogoutProfileActions } from '~/components/Header/actions';
import chevronDown from '~/components/Header/assets/chevronDown.svg';
import chevronUp from '~/components/Header/assets/chevronUp.svg';
import invite from '~/components/Header/assets/invite.svg';
import logout from '~/components/Header/assets/logout.svg';
import phoneMenu from '~/components/Header/assets/PhoneMenu.svg';
import phoneMenuGreen from '~/components/Header/assets/PhoneMenuGreen.svg';
import privacy from '~/components/Header/assets/privacyPolicy.svg';
import securityCentre from '~/components/Header/assets/securityCentre.svg';
import terms from '~/components/Header/assets/terms.svg';
import Block from '~/components/layout/Block';
import Hairline from '~/components/layout/Hairline';
import Img from '~/components/layout/Image';
import Typography from '~/components/layout/Typography';
import ListMenu, { PhoneHook } from '~/components/templates/menu/ListMenu';
import {
  INVITE_ROUTE,
  LOGIN_ROUTE,
  PRIVACY_POLICY_ROUTE,
  SECURITY_CENTER_ROUTE,
  TERMS_OF_SERVICE_ROUTE,
} from '~/routes';
import { history } from '~/store';
import { border, lg, xs } from '~/theme/variables';
import { PhoneLinks } from '../LinksMenu';

export const SECURITY_CENTER_ID = 'security-center';
export const INVITE_FRIENDS_ID = 'invite-friends';
export const TERMS_CONDITIONS_ID = 'terms';
export const PRIVACY_POLICY_ID = 'privacy-policy';
export const LOG_OUT_ID = 'log-out';

export const MENU_ID = 'hi-menu';

interface Props extends PhoneHook, WithStyles<typeof styles>, LogoutProfileActions {}

interface HiElementProps {
  readonly src: string;
  readonly alt: string;
  readonly msg: string;
  readonly id: string;
  readonly phone: boolean;
  readonly action: () => void;
  readonly height?: string;
}

const HiElement = ({ src, alt, id, action, phone, msg, height = '18' }: HiElementProps) => {
  const ItemIcon = () => (
    <ListItemIcon>
      <Img src={src} alt={alt} height={height} />
    </ListItemIcon>
  );

  return (
    <ListItem id={id} disableGutters button onClick={action}>
      {!phone && <ItemIcon />}
      <ListItemText disableTypography>
        <Typography variant={phone ? 'body1' : 'body2'}>{msg}</Typography>
      </ListItemText>
      {phone && <ItemIcon />}
    </ListItem>
  );
};

const styles = createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  chevron: {
    padding: xs,
  },
  separator: {
    height: '30px',
    paddingRight: lg,
    borderLeft: `1px solid ${border}`,
  },
});

const onSecurityCenter = () => {
  history.push(SECURITY_CENTER_ROUTE);
};

const onInvite = () => {
  history.push(INVITE_ROUTE);
};

const onTerms = () => {
  history.push(TERMS_OF_SERVICE_ROUTE);
};

const onPolicy = () => {
  history.push(PRIVACY_POLICY_ROUTE);
};

const onLogout = (logoutProfile: (dispatch?: any) => Promise<void>) => async () => {
  await logoutProfile();
  history.push(LOGIN_ROUTE);
};

const HiMenu = ({ classes, phoneMode, logoutProfile, ...rest }: Props) => {
  const phoneStarter = (open: boolean) => (
    <React.Fragment>
      <Block className={classes.separator} />
      <Block>
        {open ? <Img src={phoneMenuGreen} alt="Phone Menu" /> : <Img src={phoneMenu} alt="Phone Menu" />}
      </Block>
    </React.Fragment>
  );

  const desktopStarter = (open: boolean) => (
    <Block className={classes.root}>
      <Typography variant="h6">Hi!</Typography>
      <IconButton disableRipple>
        <Img src={open ? chevronUp : chevronDown} alt="Open" />
      </IconButton>
    </Block>
  );

  return (
    <ListMenu
      starter={phoneMode ? phoneStarter : desktopStarter}
      listWidth={280}
      phoneMode={phoneMode}
      listId={MENU_ID}
      {...rest}
    >
      <Block padding={phoneMode ? 'lg' : 'md'}>
        {phoneMode && <PhoneLinks />}
        <HiElement
          height="20"
          id={SECURITY_CENTER_ID}
          src={securityCentre}
          phone={phoneMode}
          action={onSecurityCenter}
          msg="Security Center"
          alt="Security Center"
        />
        {!phoneMode && <Hairline color={border} />}
        <HiElement
          src={invite}
          id={INVITE_FRIENDS_ID}
          action={onInvite}
          phone={phoneMode}
          msg="Invite friends"
          alt="Invite friends"
        />
        {!phoneMode && <Hairline color={border} />}
        <HiElement
          src={terms}
          id={TERMS_CONDITIONS_ID}
          action={onTerms}
          phone={phoneMode}
          msg="Terms & Conditions"
          alt="Terms & Conditions"
        />
        {!phoneMode && <Hairline color={border} />}
        <HiElement
          src={privacy}
          id={PRIVACY_POLICY_ID}
          action={onPolicy}
          phone={phoneMode}
          msg="Privacy Policy"
          alt="Privacy Policy"
        />
        {!phoneMode && <Hairline color={border} />}
        <HiElement
          src={logout}
          id={LOG_OUT_ID}
          action={onLogout(logoutProfile)}
          phone={phoneMode}
          msg="Log out"
          alt="Log out"
        />
      </Block>
    </ListMenu>
  );
};

export default withStyles(styles)(HiMenu);
