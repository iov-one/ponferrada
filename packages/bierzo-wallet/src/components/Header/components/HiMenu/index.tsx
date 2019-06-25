import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Image from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import ListMenu from 'medulas-react-components/lib/templates/menu/ListMenu';
import * as React from 'react';
import chevronDown from '~/components/Header/assets/chevronDown.svg';
import chevronUp from '~/components/Header/assets/chevronUp.svg';
import invite from '~/components/Header/assets/invite.svg';
import privacy from '~/components/Header/assets/privacyPolicy.svg';
import securityCentre from '~/components/Header/assets/securityCentre.svg';
import terms from '~/components/Header/assets/terms.svg';
import { getBorderColor } from '../../../../theme/css';

export const SECURITY_CENTER_ID = 'security-center';
export const INVITE_FRIENDS_ID = 'invite-friends';
export const TERMS_CONDITIONS_ID = 'terms';
export const PRIVACY_POLICY_ID = 'privacy-policy';
export const LOG_OUT_ID = 'log-out';

export const MENU_ID = 'hi-menu';

interface HiElementProps {
  readonly src: string;
  readonly alt: string;
  readonly msg: string;
  readonly id: string;
  readonly action: () => void;
  readonly height?: string;
}

const HiElement = ({ src, alt, id, action, msg, height = '18' }: HiElementProps): JSX.Element => {
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
    display: 'flex',
    alignItems: 'center',
  },
  chevron: {
    padding: `${theme.spacing(1)}px`,
  },
  separator: {
    height: '30px',
    paddingRight: `${theme.spacing(4)}px`,
    borderLeft: `1px solid ${getBorderColor(theme)}`,
  },
}));

const onSecurityCenter = (): void => {
  // history.push(SECURITY_CENTER_ROUTE);
};

const onInvite = (): void => {
  // history.push(INVITE_ROUTE);
};

const onTerms = (): void => {
  // history.push(TERMS_OF_SERVICE_ROUTE);
};

const onPolicy = (): void => {
  // history.push(PRIVACY_POLICY_ROUTE);
};

const HiMenu = (props: {}): JSX.Element => {
  const classes = useStyles();
  const { ...rest } = props;

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
      <Block padding={2}>
        <HiElement
          height="20"
          id={SECURITY_CENTER_ID}
          src={securityCentre}
          action={onSecurityCenter}
          msg="Security Center"
          alt="Security Center"
        />
        <Hairline />
        <HiElement
          src={invite}
          id={INVITE_FRIENDS_ID}
          action={onInvite}
          msg="Invite friends"
          alt="Invite friends"
        />
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
      </Block>
    </ListMenu>
  );
};

export default HiMenu;
