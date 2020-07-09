import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import { ActionMenuItem, Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { AccountLocationState } from "../..";
import { history } from "../../..";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import {
  NAME_DELETE_ROUTE,
  NAME_EDIT_ROUTE,
  NAME_TRANSFER_BACK_ROUTE,
  NAME_TRANSFER_ROUTE,
} from "routes/paths";
import arrowDown from "../assets/arrow-down.svg";
import arrowUp from "../assets/arrow-up.svg";

export const ACCOUNT_MANAGE_CREATE_NAME_LINK = "account-manage-create-name-link";
export const ACCOUNT_MANAGE_TOGGLE_SHOW_NAMES = "account-manage-toggle-show-names";

interface Props {
  readonly domain: BwAccountWithChainName;
  readonly names: readonly BwAccountWithChainName[];
  readonly onRegisterName: () => void;
}

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

const AssociatedNamesList: React.FunctionComponent<Props> = ({
  domain,
  names,
  onRegisterName,
}): React.ReactElement => {
  const [show, setShow] = React.useState(false);
  const [showIcon, setShowIcon] = React.useState(arrowUp);

  const paperClasses = usePaper();

  React.useEffect(() => {
    if (show) {
      setShowIcon(arrowDown);
    } else {
      setShowIcon(arrowUp);
    }
  }, [show]);

  const toggleShowAccounts = (): void => {
    setShow(show => !show);
  };

  const hasAssociatedNames = names.length > 0;

  return (
    <React.Fragment>
      <Block width={650} display="flex" justifyContent="center" flexDirection="column">
        <Paper classes={paperClasses}>
          <Block padding={2} border="1px solid #F3F3F3" display="flex" justifyContent="center">
            <Typography
              variant="subtitle1"
              color="primary"
              weight="semibold"
              align="center"
              link
              onClick={onRegisterName}
              data-test={ACCOUNT_MANAGE_CREATE_NAME_LINK}
            >
              + Create a new name
            </Typography>
          </Block>
        </Paper>

        {hasAssociatedNames && (
          <React.Fragment>
            <Block marginTop={4} display="flex" justifyContent="center">
              <Block onClick={toggleShowAccounts} data-test={ACCOUNT_MANAGE_TOGGLE_SHOW_NAMES}>
                <Block display="inline" marginRight={1}>
                  <Typography variant="subtitle2" weight="semibold" align="center" inline link>
                    Names associated with this starname
                  </Typography>
                </Block>
                <Image src={showIcon} alt="arrow" />
              </Block>
            </Block>
            <Collapse in={show}>
              {names
                .slice()
                .sort((a, b) =>
                  `${a.name}*${a.domain}`.localeCompare(`${b.name}*${b.domain}`, undefined, {
                    sensitivity: "base",
                  }),
                )
                .map(name => {
                  const onEdit = (): void => {
                    history.push(NAME_EDIT_ROUTE, name);
                  };

                  const accountState: AccountLocationState = {
                    domain: domain,
                    account: name,
                  };

                  const menuItems: readonly ActionMenuItem[] = [
                    { title: "Transfer name", action: () => history.push(NAME_TRANSFER_ROUTE, accountState) },
                    {
                      title: "Transfer it back to me",
                      action: () => history.push(NAME_TRANSFER_BACK_ROUTE, accountState),
                    },
                    { title: "Delete name", action: () => history.push(NAME_DELETE_ROUTE, accountState) },
                  ];

                  return (
                    <AccountManage
                      key={`${name.name}*${name.domain}`}
                      menuItems={menuItems}
                      onEdit={onEdit}
                      account={name}
                      hideExpiration={true}
                      transferedTo={domain.owner !== name.owner ? name.owner : undefined}
                    />
                  );
                })}
            </Collapse>
          </React.Fragment>
        )}
      </Block>
    </React.Fragment>
  );
};

export default AssociatedNamesList;
