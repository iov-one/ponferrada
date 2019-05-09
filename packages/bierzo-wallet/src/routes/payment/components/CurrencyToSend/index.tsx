import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { FormApi } from 'final-form';
import Block from 'medulas-react-components/lib/components/Block';
import SelectFieldForm, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Typography from 'medulas-react-components/lib/components/Typography';
import {
  composeValidators,
  greaterOrEqualThan,
  lowerOrEqualThan,
  number,
  required,
} from 'medulas-react-components/lib/utils/forms/validators';
import React, { useState } from 'react';

const useStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: '#ffe152',
    fontSize: '27.5px',
    width: '72px',
    height: '72px',
    margin: '-76px 0 40px 0',
  },
}));

const QUANTITY_FIELD = 'quantityField';
const QUANTITY_MAX = 9999999;
const QUANTITY_MIN = 1e-9;
const CURRENCY_FIELD = 'currencyField';

interface Currencies {
  [key: string]: number;
}

//NOTE hardcoded placeholder balances for each currency
const currencies: Currencies = {
  ALT: 15,
  IOV: 24,
};

const currencyItems = Object.keys(currencies).map(currency => {
  const item: Item = {
    name: currency,
  };

  return item;
});

interface Props {
  form: FormApi;
}

const CurrencyToSend = (props: Props): JSX.Element => {
  const classes = useStyles();
  //NOTE hardcoded initial state for "currency"
  const [currency, setCurrency] = useState(currencyItems[1].name);
  const [balance, setBalance] = useState(currencies[currency]);

  const avatarClasses = {
    root: classes.avatar,
  };

  const handleChange = (item: Item): void => {
    setCurrency(item.name);
    setBalance(currencies[item.name]);
  };

  return (
    <Paper>
      <Block
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        marginTop={'36px'}
        padding={5}
      >
        <Avatar classes={avatarClasses}>
          <FontAwesomeIcon icon={faUser} color="#ffffff" />
        </Avatar>
        <Typography color="textPrimary" variant="subtitle2">
          You send
        </Typography>
        <Block width="100%" marginTop={5} marginBottom={1}>
          <Block display="flex">
            <Block width="100%" marginRight={1}>
              <TextFieldForm
                name={QUANTITY_FIELD}
                form={props.form}
                validate={composeValidators(
                  required,
                  number,
                  lowerOrEqualThan(balance),
                  lowerOrEqualThan(QUANTITY_MAX),
                  greaterOrEqualThan(QUANTITY_MIN)
                )}
                placeholder="0,00"
                fullWidth
                margin="none"
              />
            </Block>
            {/*NOTE hardcoded initial value*/}
            <Block height="32px">
              <SelectFieldForm
                fieldName={CURRENCY_FIELD}
                form={props.form}
                maxWidth="60px"
                items={currencyItems}
                initial={currencyItems[1].name}
                value={currency}
                onChangeCallback={handleChange}
              />
            </Block>
          </Block>
        </Block>
        <Block marginTop={1}>
          <Typography color="textSecondary" variant="subtitle2">
            balance: {balance} {currency}
          </Typography>
        </Block>
      </Block>
    </Paper>
  );
};

export default CurrencyToSend;
