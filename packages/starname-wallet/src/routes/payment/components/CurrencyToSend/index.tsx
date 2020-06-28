import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TokenTicker } from "@iov/bcp";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/styles";
import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  greaterThan,
  lowerOrEqualThan,
  maxFractionalDigits,
  number,
  required,
  SelectField,
  SelectFieldItem,
  TextField,
  Typography,
} from "medulas-react-components";
import React, { useMemo, useState } from "react";
import { amountToNumber, amountToString } from "ui-logic";

import { BalanceState } from "../../../../store/balances";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: "#ffe152",
    fontSize: "27.5px",
    width: "72px",
    height: "72px",
    margin: "-76px 0 40px 0",
  },
});

export const QUANTITY_FIELD = "quantityField";
const QUANTITY_MIN = 0;
export const CURRENCY_FIELD = "currencyField";

interface Props {
  readonly form: FormApi;
  readonly balances: BalanceState;
  readonly noBalance: boolean;
  readonly onTokenSelectionControl: (ticker: TokenTicker) => Promise<void>;
}

const CurrencyToSend = ({ form, onTokenSelectionControl, balances, noBalance }: Props): JSX.Element => {
  const classes = useStyles();

  const currencyItems = Object.keys(balances)
    .sort()
    .map((ticker): SelectFieldItem => ({ name: ticker }));

  const firstToken = currencyItems.find(() => true);
  const [selectedTokenTicker, setSelectedTokenTicker] = useState(firstToken ? firstToken.name : undefined);

  const validator = useMemo(() => {
    return composeValidators(
      required,
      number,
      maxFractionalDigits(selectedTokenTicker ? balances[selectedTokenTicker].fractionalDigits : 0),
      lowerOrEqualThan(selectedTokenTicker ? amountToNumber(balances[selectedTokenTicker]) : 0),
      greaterThan(QUANTITY_MIN),
    );
  }, [balances, selectedTokenTicker]);

  React.useEffect(() => {
    onTokenSelectionControl(selectedTokenTicker as TokenTicker);
  }, [onTokenSelectionControl, selectedTokenTicker]);

  const onSelectionChanged = (item: SelectFieldItem | undefined): void => {
    if (item) {
      setSelectedTokenTicker(item.name);
    }
  };

  const avatarClasses = {
    root: classes.avatar,
  };

  return (
    <Block width="100%" display="flex" flexDirection="column" alignItems="center">
      <Avatar classes={avatarClasses}>
        <FontAwesomeIcon icon={faUser} color="#ffffff" />
      </Avatar>
      <Typography color="textPrimary" variant="subtitle2">
        Send tokens
      </Typography>
      <Block width="100%" marginTop={4}>
        <Typography color="textPrimary" variant="subtitle2">
          Amount
        </Typography>
        <Block display="flex" marginTop={1}>
          <Block width="100%">
            <TextField
              name={QUANTITY_FIELD}
              form={form}
              validate={validator}
              placeholder="0.00"
              fullWidth
              margin="none"
              disabled={noBalance}
            />
          </Block>
          <Block marginTop={0.5} marginLeft={1}>
            <SelectField
              fieldName={CURRENCY_FIELD}
              form={form}
              maxWidth="60px"
              items={currencyItems}
              initial={firstToken ? firstToken.name : "–"}
              onChangeCallback={onSelectionChanged}
              disabled={noBalance}
            />
          </Block>
        </Block>
        <Block marginTop={1}>
          <Typography color="textPrimary" variant="subtitle2">
            Balance: {selectedTokenTicker ? amountToString(balances[selectedTokenTicker]) : "–"}
          </Typography>
        </Block>
      </Block>
    </Block>
  );
};

export default CurrencyToSend;
