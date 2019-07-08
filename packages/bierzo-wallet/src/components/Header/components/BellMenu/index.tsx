import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from 'medulas-react-components/lib/components/Badge';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import EmptyListIcon from 'medulas-react-components/lib/templates/menu/EmptyListIcon';
import ListMenu from 'medulas-react-components/lib/templates/menu/ListMenu';
import * as React from 'react';

import { ProcessedTx } from '../../../../store/notifications';
import { getLastTx, storeLastTx } from '../../../../utils/localstorage/transactions';
import bell from '../../assets/bell.svg';
import bellGreen from '../../assets/bellGreen.svg';
import upToDate from '../../assets/uptodate.svg';
import { BadgeProps, calcBadgeProps } from './badgeCalculator';
import TxItem from './TxItem';

interface Props {
  readonly items: ReadonlyArray<ProcessedTx>;
  readonly lastTx?: ProcessedTx;
}

const BellMenu = ({ items, lastTx }: Props): JSX.Element => {
  const toogleCallback = (): void => {
    if (!lastTx) {
      return;
    }

    storeLastTx(lastTx);
  };

  const starter = (open: boolean): JSX.Element => {
    const logo = open ? bellGreen : bell;
    const badgeProps: BadgeProps = calcBadgeProps(lastTx, getLastTx());

    return (
      <Block paddingLeft={5} paddingRight={5}>
        <Badge color={badgeProps.color} invisible={badgeProps.invisible} variant="dot">
          <Img src={logo} alt="Transactions Menu" />
        </Badge>
      </Block>
    );
  };

  const hasItems = items.length > 0;

  return (
    <ListMenu starter={starter} listWidth={324} onClick={toogleCallback}>
      <Block padding={0.5}>
        <ListItem>
          <ListItemText disableTypography>
            <Typography variant="body2" weight="semibold">
              Notifications
            </Typography>
          </ListItemText>
        </ListItem>
      </Block>
      <Hairline />
      {hasItems ? (
        items.map((item: ProcessedTx, index: number) => {
          const lastOne = index + 1 === items.length;

          return <TxItem key={item.id} item={item} lastOne={lastOne} />;
        })
      ) : (
        <EmptyListIcon src={upToDate} alt="Up to date" text="Up to date" />
      )}
    </ListMenu>
  );
};

export default BellMenu;
