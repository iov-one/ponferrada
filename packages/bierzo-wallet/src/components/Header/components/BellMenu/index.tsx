import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import bell from '~/components/Header/assets/bell.svg';
import bellGreen from '~/components/Header/assets/bellGreen.svg';
import upToDate from '~/components/Header/assets/uptodate.svg';
import BadgeIcon from 'medulas-react-components/lib/components/BadgeIcon';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Typography from 'medulas-react-components/lib/components/Typography';
import EmptyListIcon from '~/components/templates/menu/EmptyListIcon';
import ListMenu, { PhoneHook } from '~/components/templates/menu/ListMenu';
import { getLastTx, storeLastTx } from '../../../../utils/localstorage/transactions';
import { BadgeProps, calcBadgeProps } from './badgeCalculator';
import TxItem from './TxItem';
import { ProcessedTx } from '../../../../store/reducers/notifications/state';

interface Props extends PhoneHook {
  readonly items: ReadonlyArray<ProcessedTx>;
  readonly lastTx?: ProcessedTx;
}

class BellMenu extends React.Component<Props> {
  public readonly toogleCallback = () => {
    if (!this.props.lastTx) {
      return;
    }

    storeLastTx(this.props.lastTx);
  };

  public render(): JSX.Element {
    const { items, phoneMode, lastTx, ...rest } = this.props;

    const starter = (open: boolean) => {
      const logo = open ? bellGreen : bell;
      const badgeProps: BadgeProps = calcBadgeProps(lastTx, getLastTx());

      return (
        <Block padding="xl">
          <BadgeIcon
            color={badgeProps.color}
            invisible={badgeProps.invisible}
            icon={logo}
            alt="Transactions"
            badge="dot"
          />
        </Block>
      );
    };

    const hasItems = items.length > 0;

    return (
      <ListMenu
        starter={starter}
        listWidth={324}
        phoneMode={phoneMode}
        onClick={this.toogleCallback}
        {...rest}
      >
        <Block padding={phoneMode ? 'sm' : 'xs'}>
          <ListItem>
            <ListItemText disableTypography>
              <Typography variant={phoneMode ? 'body1' : 'body2'} weight="semibold">
                Notifications
              </Typography>
            </ListItemText>
          </ListItem>
        </Block>
        <Hairline color={border} />
        {hasItems ? (
          items.map((item: ProcessedTx, index: number) => {
            const lastOne = index + 1 === items.length;

            return <TxItem key={item.id} phone={phoneMode} item={item} lastOne={lastOne} />;
          })
        ) : (
          <EmptyListIcon src={upToDate} alt="Up to date Invite friends" text="Up to date Invite friends" />
        )}
      </ListMenu>
    );
  }
}

export default BellMenu;
