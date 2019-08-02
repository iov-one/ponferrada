import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Address, ChainId } from '@iov/bcp';
import { Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import makeStyles from 'medulas-react-components/lib/theme/utils/styles';
import React from 'react';

export interface ChainAddressMap {
  readonly chainId: ChainId;
  readonly chainName: string;
  readonly address: Address;
}

export const PAYMENT_CONFIRMATION_VIEW_ID = 'payment-confirmation-view-id';

const useAvatar = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: '#ffe152',
    fontSize: '27.5px',
    width: '72px',
    height: '72px',
    margin: '-76px 0 40px 0',
  },
}));

interface Props {
  readonly chainAddressMap: ReadonlyArray<ChainAddressMap>;
  readonly onReturnToPayment: () => void;
}

const ReceivePayment = ({ chainAddressMap, onReturnToPayment }: Props): JSX.Element => {
  const avatarClasses = useAvatar();
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">Blockchain</TableCell>
                  <TableCell align="right">Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chainAddressMap.map(chain => (
                  <TableRow key={chain.chainId}>
                    <TableCell align="right">{chain.chainName}</TableCell>
                    <TableCell align="right">{chain.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Block>
        </Paper>

        <Block marginTop={4}>
          <Button fullWidth onClick={onReturnToPayment}>
            Return to Payment
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default ReceivePayment;
