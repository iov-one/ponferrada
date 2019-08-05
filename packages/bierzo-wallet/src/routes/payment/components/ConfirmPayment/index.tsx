import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionId } from "@iov/bcp";
import { Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/styles";
import Block from "medulas-react-components/lib/components/Block";
import Button from "medulas-react-components/lib/components/Button";
import Typography from "medulas-react-components/lib/components/Typography";
import makeStyles from "medulas-react-components/lib/theme/utils/styles";
import React from "react";

export const PAYMENT_CONFIRMATION_VIEW_ID = "payment-confirmation-view-id";

const useAvatar = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: "#ffe152",
    fontSize: "27.5px",
    width: "72px",
    height: "72px",
    margin: "-76px 0 40px 0",
  },
}));

const useTypography = makeStyles({
  wrap: {
    width: 370,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
});

interface Props {
  readonly transactionId: TransactionId;
  readonly onNewPayment: () => void;
  readonly onSeeTrasactions: () => void;
  readonly onReturnToBalance: () => void;
}

const ConfirmPayment = ({
  transactionId,
  onNewPayment,
  onSeeTrasactions,
  onReturnToBalance,
}: Props): JSX.Element => {
  const avatarClasses = useAvatar();
  const typographyClasses = useTypography();
  const theme = useTheme<Theme>();

  return (
    <Block
      id={PAYMENT_CONFIRMATION_VIEW_ID}
      marginTop={4}
      display="flex"
      alignContent="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
    >
      <Block width={450}>
        <Paper>
          <Block
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            marginTop={4}
            padding={5}
          >
            <Avatar classes={avatarClasses}>
              <FontAwesomeIcon icon={faUser} color="#ffffff" />
            </Avatar>
            <Typography variant="h6" weight="light">
              Your transaction was successfully signed and sent to the network.
            </Typography>
            <Block marginTop={2}>
              <Typography variant="h6" weight="light">
                Transaction ID:
              </Typography>
              <Typography
                variant="body2"
                weight="semibold"
                color="primary"
                className={typographyClasses.wrap}
              >
                {transactionId}
              </Typography>
            </Block>
          </Block>
        </Paper>

        <Block marginTop={4}>
          <Button fullWidth onClick={onNewPayment}>
            New Payment
          </Button>
        </Block>
        <Block marginTop={2} onClick={onSeeTrasactions}>
          <Button fullWidth>See Transactions</Button>
        </Block>
        <Block marginTop={2} onClick={onReturnToBalance}>
          <Button fullWidth>Return to Balance</Button>
        </Block>
      </Block>
    </Block>
  );
};

export default ConfirmPayment;
