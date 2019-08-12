import { faRegistered } from "@fortawesome/free-regular-svg-icons";
import { TransactionId } from "@iov/bcp";
import { Block, Button, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import PageContent from "../../../components/PageContent";

export const USERNAME_CONFIRMATION_VIEW_ID = "username-confirmation-view-id";

const useTypography = makeStyles({
  wrap: {
    width: 570,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
});

interface Props {
  readonly transactionId: TransactionId;
  readonly onSeeTrasactions: () => void;
  readonly onReturnToBalance: () => void;
}

const ConfirmRegistration = ({ transactionId, onSeeTrasactions, onReturnToBalance }: Props): JSX.Element => {
  const typographyClasses = useTypography();

  const buttons = (
    <Block
      marginTop={4}
      marginBottom={1}
      justifyContent="center"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Block width="75%">
        <Button fullWidth>See Transactions</Button>
      </Block>
      <Block width="75%" marginTop={2}>
        <Button fullWidth>Return to Balance</Button>
      </Block>
    </Block>
  );

  return (
    <PageContent id={USERNAME_CONFIRMATION_VIEW_ID} icon={faRegistered} buttons={buttons}>
      <Typography variant="h6" weight="light">
        Your username registration request was successfully signed and sent to the network.
      </Typography>
      <Block marginTop={2}>
        <Typography variant="h6" weight="light">
          Transaction ID:
        </Typography>
        <Typography variant="body2" weight="semibold" color="primary" className={typographyClasses.wrap}>
          {transactionId}
        </Typography>
      </Block>
    </PageContent>
  );
};

export default ConfirmRegistration;
