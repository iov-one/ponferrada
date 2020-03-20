import { Address } from "@iov/bcp";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import { ActionMenuItem, Block, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { history } from "../../..";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import { NAME_EDIT_ROUTE, NAME_TRANSFER_ROUTE } from "../../../paths";
import arrowDown from "../assets/arrow-down.svg";
import arrowUp from "../assets/arrow-up.svg";

interface Props {
  readonly bnsAddress: Address;
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
  bnsAddress,
  names,
  onRegisterName,
}): JSX.Element => {
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

        <Block marginTop={4} display="flex" justifyContent="center">
          <Block onClick={toggleShowAccounts}>
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

              const menuItems: readonly ActionMenuItem[] = [
                { title: "Transfer name", action: () => history.push(NAME_TRANSFER_ROUTE, name) },
                // eslint-disable-next-line no-console
                { title: "Transfer it back to me", action: () => console.log("Transfer it back to me") },
                // eslint-disable-next-line no-console
                { title: "Delete name", action: () => console.log("Delete name") },
              ];

              return (
                <AccountManage
                  key={`${name.name}*${name.domain}`}
                  menuItems={menuItems}
                  onEdit={onEdit}
                  account={name}
                  hideExpiration={true}
                  transferedTo={bnsAddress !== name.owner ? name.owner : undefined}
                />
              );
            })}
        </Collapse>
      </Block>
    </React.Fragment>
  );
};

export default AssociatedNamesList;
