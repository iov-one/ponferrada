import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Form, {
  FormValues,
  useForm,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import SelectFieldForm, { Item } from 'medulas-react-components/lib/components/forms/SelectFieldForm';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Typography from 'medulas-react-components/lib/components/Typography';
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

const onSubmit = () => {};

const CurrencyToSend = () => {
  const classes = useStyles();

  const avatarClasses = {
    root: classes.avatar,
  };

  //NOTE hardcoded initial state for "currency"
  const [currency, setCurrency] = useState(currencyItems[1].name);
  const [balance, setBalance] = useState(currencies[currency]);

  const handleChange = (item: Item) => {
    setCurrency(item.name);
    setBalance(currencies[item.name]);
  };

  //NOTE placed this function inside the component so that it has access to "balance"
  const validate = (values: object): object => {
    const formValues = values as FormValues;
    const errors: ValidationError = {};

    const quantity = formValues[QUANTITY_FIELD];

    if (!quantity) {
      errors[QUANTITY_FIELD] = 'Required';
      return errors;
    }

    const numQuantity = Number(quantity);

    if (isNaN(numQuantity)) {
      errors[QUANTITY_FIELD] = 'Must be a number';
      return errors;
    }

    if (numQuantity > balance) {
      errors[QUANTITY_FIELD] = `Should be lower or equal than ${balance}`;
    }

    if (numQuantity > QUANTITY_MAX) {
      errors[QUANTITY_FIELD] = `Should be lower than ${QUANTITY_MAX}`;
    }

    if (numQuantity < QUANTITY_MIN) {
      errors[QUANTITY_FIELD] = `Should be greater or equal than ${QUANTITY_MIN}`;
    }

    return errors;
  };

  const { form, handleSubmit } = useForm({
    onSubmit,
    validate,
  });

  return (
    <Paper>
      <Block display="flex" flexDirection="column" alignItems="center" width="100%" padding={5}>
        <Avatar classes={avatarClasses}>
          <FontAwesomeIcon icon={faUser} color="#ffffff" />
        </Avatar>
        <Typography color="textPrimary" variant="subtitle2">
          You send
        </Typography>
        {/*TODO remove extra left-right margins of the form*/}
        <Form onSubmit={handleSubmit}>
          <Block display="flex" marginTop={5} marginBottom={1}>
            <Block marginRight={1}>
              <TextFieldForm name={QUANTITY_FIELD} form={form} required placeholder="0,00" fullWidth />
            </Block>
            {/*NOTE hardcoded initial value*/}
            <SelectFieldForm
              fieldName={CURRENCY_FIELD}
              form={form}
              maxWidth="60px"
              items={currencyItems}
              initial={currencyItems[1].name}
              value={currency}
              onChangeCallback={handleChange}
            />
          </Block>
        </Form>
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
