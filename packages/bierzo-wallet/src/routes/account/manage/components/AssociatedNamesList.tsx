import Paper from "@material-ui/core/Paper";
import { ActionMenuItem, Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../../..";
import starnameLogo from "../../../../assets/starname-logo.svg";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import { BwAccount } from "../../../../store/accounts";
import { NAME_EDIT_ROUTE, NAME_MANAGE_ROUTE, REGISTER_STARNAME_ROUTE } from "../../../paths";
import arrowDown from "../assets/arrow-down.svg";
import arrowUp from "../assets/arrow-up.svg";

interface Props {
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

const menuItems: readonly ActionMenuItem[] = [
  { title: "Transfer name", action: () => console.log("Transfer name") },
  { title: "Transfer it back to me", action: () => console.log("Transfer it back to me") },
  { title: "Delete name", action: () => console.log("Delete name") },
];

const AssociatedNamesList: React.FunctionComponent<Props> = ({ names, onRegisterName }): JSX.Element => {
  const paperClasses = usePaper();

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
            >
              + Create a new name
            </Typography>
          </Block>
        </Paper>

        <Block marginTop={4} marginBottom={3} display="flex" justifyContent="center">
          <Block>
            <Block display="inline" marginRight={1}>
              <Typography variant="subtitle2" weight="semibold" align="center" inline>
                Names associated with this starname
              </Typography>
            </Block>
            <Image src={arrowUp} alt="arrow" />
          </Block>
        </Block>
        {names
          .slice()
          .sort((a, b) =>
            `${a.name}*${a.domain}`.localeCompare(`${b.name}*${b.domain}`, undefined, {
              sensitivity: "base",
            }),
          )
          .map(name => {
            const onEditAccount = (): void => {
              history.push(NAME_EDIT_ROUTE, name);
            };

            return (
              <AccountManage
                menuItems={menuItems}
                onEditAccount={onEditAccount}
                account={name}
                hideExpiration={true}
              />
            );
          })}
      </Block>
    </React.Fragment>
  );
};

export default AssociatedNamesList;
