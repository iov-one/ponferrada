import { Amount } from "@iov/bcp";
import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Button, Image, Typography } from "medulas-react-components";
import React from "react";

import neumaLogo from "./../../../components/Header/assets/neumaWalletLogo.svg";

interface Props {
  readonly iovAddress?: string;
  readonly iovAddressWithNewChain?: string;
  readonly balances: { [token: string]: Amount };
  readonly onRegisterIovname: () => void;
  readonly onUpgradeIovname?: () => void;
  readonly onGoHome?: () => void;
}

const UpgradeProcess = ({
  iovAddress,
  balances,
  onRegisterIovname,
  onUpgradeIovname,
  onGoHome,
  iovAddressWithNewChain,
}: Props): JSX.Element => {
  const theme = useTheme<Theme>();
  return (
    <Block alignSelf="center" textAlign="center" width="500px">
      <Image src={neumaLogo} alt="logo" />
      <Block margin={2} />
      {!iovAddressWithNewChain && (
        <>
          {!iovAddress && (
            <Block
              width={500}
              bgcolor={theme.palette.background.paper}
              padding={5}
              display="flex"
              flexDirection="column"
              borderRadius={5}
              textAlign="center"
              border="1px solid #F3F3F3"
              fontSize={24}
            >
              <Block marginTop={3} />
              <Typography variant="h5" weight="semibold" gutterBottom>
                Please register an iovname <br /> before the migration
              </Typography>
              <br />
              <Typography variant="body1" color="textPrimary">
                We will do a migration soon as we are improving our technology. To make sure you receive your
                IOV tokens just after the migration, please click on the button below and create an iovname.
              </Typography>
              <Block marginTop={3} />
              <Button onClick={onRegisterIovname}>Register Now</Button>
              <br />
              <Typography
                id="Ok-home"
                variant="subtitle1"
                color="primary"
                weight="semibold"
                inline
                link
                style={{ fontSize: "12px", textDecoration: "none", color: "grey", cursor: "pointer" }}
                onClick={onGoHome}
              >
                Later
              </Typography>
            </Block>
          )}
          {iovAddress && (
            <Block
              width={500}
              bgcolor={theme.palette.background.paper}
              padding={5}
              display="flex"
              flexDirection="column"
              borderRadius={5}
              textAlign="center"
              border="1px solid #F3F3F3"
              fontSize={18}
            >
              <Typography variant="h5" weight="semibold" gutterBottom>
                Please upgrade your account <br /> before the migration
              </Typography>
              <br />
              We will do a migration soon as we are improving our technology. To make sure you receive your
              IOV tokens just after the migration, please click on the button below and follow the steps.
              <br />
              <br />
              <Button onClick={onUpgradeIovname}>Upgrade Now</Button>
              <br />
              <Typography
                id="Ok-home"
                variant="subtitle1"
                color="primary"
                weight="semibold"
                inline
                link
                style={{ fontSize: "12px", textDecoration: "none", color: "grey", cursor: "pointer" }}
                onClick={onGoHome}
              >
                Later
              </Typography>
            </Block>
          )}
        </>
      )}
      {iovAddressWithNewChain && (
        <>
          <Block
            width={500}
            bgcolor={theme.palette.background.paper}
            padding={5}
            display="flex"
            flexDirection="column"
            borderRadius={5}
            textAlign="center"
            border="1px solid #F3F3F3"
            fontSize={18}
          >
            Your account has been successfully upgraded. <br /> <br />
            You are all set!
            <br />
            <br />
            <Button onClick={onGoHome}>Go Back to Neuma</Button>
          </Block>
        </>
      )}
    </Block>
  );
};

export default UpgradeProcess;
