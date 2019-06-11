import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import logoBlack from '../assets/logoBlack.svg';
import BellMenu from './BellMenu';
import HiMenu from './HiMenu';
import { LinksDesktop } from './LinksMenu';
import TransactionsMenu from './TransactionsMenu';
import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';
import { ProcessedTx, Tx } from '../../../store/reducers/notifications/state';

const styles = createStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '70px',
    backgroundColor: 'white',
  },
});

interface Props extends WithStyles<typeof styles> {
  readonly phoneMode: boolean;
  readonly pendingTxs: ReadonlyArray<Tx>;
  readonly txs: ReadonlyArray<ProcessedTx>;
  readonly lastTx: ProcessedTx | undefined;
}

interface State {
  readonly phoneHook: HTMLDivElement | null;
}

class HeaderComponent extends React.Component<Props, State> {
  public readonly state = {
    phoneHook: null,
  };
  private readonly phoneHookRef = React.createRef<HTMLDivElement>();

  public componentDidMount(): void {
    this.setState(() => ({
      phoneHook: this.phoneHookRef.current,
    }));
  }

  public render(): JSX.Element {
    const { phoneMode, classes, pendingTxs, txs, lastTx } = this.props;
    const { phoneHook } = this.state;

    return (
      <React.Fragment>
        <Block className={classes.root} padding={phoneMode ? 'lg' : 'xxl'}>
          <Img src={logoBlack} alt="Logo" />
          <Block flexGrow={1} />
          {!phoneMode && <LinksDesktop />}
          <Block flexGrow={4} />
          <TransactionsMenu phoneHook={phoneHook} phoneMode={phoneMode} items={pendingTxs} />
          <BellMenu phoneHook={phoneHook} phoneMode={phoneMode} items={txs} lastTx={lastTx} />
          <HiMenu phoneHook={phoneHook} phoneMode={phoneMode} logoutProfile={logoutProfile} />
        </Block>
        <div ref={this.phoneHookRef} />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(HeaderComponent);
