import { Amount } from '@iov/bcp';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import Link from 'medulas-react-components/lib/components/Link';
import Tooltip from 'medulas-react-components/lib/components/Tooltip';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import GridItem, { Order } from '~/components/layout/GridItem';
import { amountToString, trimAmount } from '~/logic';
import receive from '~/routes/balance/assets/transactionReceive.svg';
import send from '~/routes/balance/assets/transactionSend.svg';
import { background, md } from '~/theme/variables';

interface Props extends WithStyles<typeof styles> {
  readonly name: string | undefined;
  readonly tokens: ReadonlyArray<Amount>;
  readonly phone: boolean;
  readonly onSendPayment: () => void;
  readonly onReceivePayment: () => void;
}

const styles = createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  separator: {
    flexShrink: 1,
    flexBasis: md,
  },
  container: {
    backgroundColor: background,
    height: 'unset',
    flexBasis: '450px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    flexBasis: '90px',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'unset',
  },
  action: {
    backgroundColor: background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexBasis: '217px',
    height: '90px',
    justifyContent: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

const LISK_FAUCET = 'https://testnet-faucet.lisk.io';
const ETH_FACUET = 'https://faucet.rinkeby.io/';
const ERC20_DOCS = 'https://github.com/iov-one/wallet-demo/wiki/ERC20-demo-tokens';

interface CardProps {
  readonly text: string;
  readonly logo: string;
  readonly className: string;
  readonly onAction?: () => void;
}

const Card = ({ text, logo, className, onAction }: CardProps): JSX.Element => (
  <Block className={className} onClick={onAction}>
    <Img src={logo} height={36} width={36} alt={text} />
    <Typography>{text}</Typography>
  </Block>
);

interface State {
  readonly howItWorksHook: HTMLDivElement | null;
}

class BalanceLayout extends React.Component<Props, State> {
  public readonly state = {
    howItWorksHook: null,
  };
  private readonly howItWorksHookRef = React.createRef<HTMLDivElement>();

  public componentDidMount(): void {
    this.setState(() => ({
      howItWorksHook: this.howItWorksHookRef.current,
    }));
  }

  public render(): JSX.Element {
    const { classes, name, tokens, phone, onSendPayment, onReceivePayment } = this.props;
    const spacer: Order = { xs: 1 };
    const actions: Order = { xs: 5 };
    const actionSpacer: Order = { xs: 4 };
    const info: Order = { xs: 2 };
    const grow: Order = { xs: 3 };
    const hasTokens = tokens && tokens.length;

    return (
      <React.Fragment>
        <GridItem noHeight order={spacer}>
          <Block margin={6} />
        </GridItem>
        <GridItem noHeight order={actions} className={classes.actions}>
          <Card text="Send payment" logo={send} onAction={onSendPayment} className={classes.action} />
          {!phone && <Block className={classes.separator} />}
          <Card
            text="Receive Payment"
            logo={receive}
            onAction={onReceivePayment}
            className={classes.action}
          />
        </GridItem>
        <GridItem noHeight order={actionSpacer}>
          <Block margin={3} />
        </GridItem>
        <GridItem noHeight order={info}>
          <Block flexGrow={1} />
          <Block className={classes.container}>
            <Block padding={4} className={classes.info}>
              <Block margin={5} />
              <Typography variant="h5" align="center" weight="light">
                {name ? name : '--'}
              </Typography>
              <Hairline space={4} />
              <Typography variant="subtitle2" align="center">
                {hasTokens ? 'Your currencies' : 'No funds available'}
              </Typography>
              <Block margin={4} />
              {tokens.map(token => (
                <Typography
                  key={token.tokenTicker}
                  link
                  variant="h6"
                  weight="regular"
                  color="primary"
                  align="center"
                  onClick={onSendPayment}
                >
                  {`${amountToString(trimAmount(token))}`}
                </Typography>
              ))}
              <Block margin={1} />
              <Block className={classes.tooltip}>
                <Typography inline variant="body2">
                  need funds?
                </Typography>
                <Block padding={1} />
                <Tooltip maxWidth={350} phoneHook={this.state.howItWorksHook}>
                  <Typography variant="body2">
                    Claim test LSK: <Link to={LISK_FAUCET}>Lisk faucet</Link>
                  </Typography>
                  <Block margin={1} />
                  <Typography variant="body2">
                    Claim test ETH: <Link to={ETH_FACUET}>Rinkeby faucet</Link>
                  </Typography>
                  <Block margin={1} />
                  <Typography variant="body2">
                    Claim test ERC20s: <Link to={ERC20_DOCS}>read the docs</Link>
                  </Typography>
                </Tooltip>
              </Block>
              <div ref={this.howItWorksHookRef} />
              <Block margin={7} />
            </Block>
          </Block>
          <Block flexGrow={1} />
        </GridItem>
        <GridItem noHeight grow order={grow} />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(BalanceLayout);
