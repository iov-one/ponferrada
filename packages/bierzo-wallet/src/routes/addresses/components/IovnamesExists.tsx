import Paper from "@material-ui/core/Paper";
import clipboardCopy from "clipboard-copy";
import {
  Block,
  Image,
  makeStyles,
  ToastContext,
  ToastVariant,
  Tooltip,
  Typography,
} from "medulas-react-components";
import React from "react";

import { BwUsernameWithChainName } from "..";
import { history } from "../..";
import AddressesTable from "../../../components/AddressesTable";
import copy from "../../../components/AddressesTable/assets/copy.svg";
import { REGISTER_IOVNAME_ROUTE } from "../../paths";
import { AddressesTooltipHeader, TooltipContent } from "../../register";

interface Props {
  readonly usernames: readonly BwUsernameWithChainName[];
  readonly onRegisterUsername: () => void;
}

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
  },
});

function IovnamesExists({ usernames, onRegisterUsername }: Props): JSX.Element {
  const paperClasses = usePaper();
  const classes = useStyles();
  const toast = React.useContext(ToastContext);

  return (
    <React.Fragment>
      <Typography
        id={REGISTER_IOVNAME_ROUTE}
        link
        color="primary"
        align="center"
        onClick={onRegisterUsername}
      >
        + Create new iovname
      </Typography>
      {usernames.map(username => {
        const onIovnameCopy = (): void => {
          clipboardCopy(username.username);
          toast.show("Iovname has been copied to clipboard.", ToastVariant.INFO);
        };

        const onEdit = (): void => {
          history.push(REGISTER_IOVNAME_ROUTE, username);
        };

        return (
          <Block key={username.username} marginTop={1} width={650}>
            <Paper classes={paperClasses}>
              <Block
                display="flex"
                flexDirection="column"
                width="100%"
                marginTop={4}
                padding={5}
                border="1px solid #F3F3F3"
              >
                <Block display="flex" alignItems="center" alignSelf="center">
                  <Typography variant="h4" align="center">
                    {username.username}
                  </Typography>
                  <Block marginRight={2} />
                  <Block onClick={onIovnameCopy} className={classes.link}>
                    <Image src={copy} alt="Copy" width={20} />
                  </Block>
                </Block>
                <Block display="flex" alignItems="center" marginBottom={1} marginTop={4}>
                  <Typography variant="subtitle2" weight="semibold" inline>
                    {username.addresses.length > 0 ? "LINKED ADDRESSES" : "NO LINKED ADDRESSES"}
                  </Typography>
                  <Block marginRight={1} />
                  <Tooltip maxWidth={320}>
                    <TooltipContent header={<AddressesTooltipHeader />} title="Your linked addresses">
                      With IOV you can have an universal blockchain address that is linked to all your
                      addresses. Just give your friends your personalized address.
                    </TooltipContent>
                  </Tooltip>
                  <Block flexGrow={1} />
                  <Typography
                    variant="subtitle2"
                    weight="semibold"
                    inline
                    link
                    color="primary"
                    align="right"
                    onClick={onEdit}
                  >
                    {username.addresses.length > 0 ? "Edit" : "Link Now"}
                  </Typography>
                  <Block marginLeft={1} />
                </Block>
                <Block marginTop={2} />
                {username.addresses.length > 0 && <AddressesTable chainAddresses={username.addresses} />}
              </Block>
            </Paper>
          </Block>
        );
      })}
    </React.Fragment>
  );
}

export default IovnamesExists;
