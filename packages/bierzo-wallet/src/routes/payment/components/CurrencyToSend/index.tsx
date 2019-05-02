import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { ChangeEvent, useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    backgroundColor: '#ffe152',
    fontSize: '27.5px',
    width: '72px',
    height: '72px',
    margin: '-76px 0 40px 0',
  },
}));

interface Currencies {
  [key: string]: number;
}

//NOTE hardcoded placeholder balances for each currency
const currencies: Currencies = {
  alt: 15,
  iov: 24,
};

// TODO renders each MenuItem from the currencies array, but does not work because of Typescript type mismatch
const renderedCurrencies = Object.keys(currencies).forEach(currency => {
  return <MenuItem value={currency}>{currency.toUpperCase()}</MenuItem>;
});

export const CurrencyToSend = () => {
  const classes = useStyles();

  const avatarClasses = {
    root: classes.avatar,
  };

  const [validity, setValidity] = useState('');
  //NOTE hardcoded placeholder 'iov'
  const [currency, setCurrency] = useState('iov');
  const [balance, setBalance] = useState(currencies[currency]);

  const textFieldHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    setValidity('');

    if (isNaN(value)) {
      setValidity('Must be a number');
    } else {
      if (value > balance) {
        setValidity(`Should be lower or equal than ${balance}`);
      }

      //TODO find out max limit
      if (value > 9999999) {
        setValidity('Should be lower than 9999999');
      }

      if (value < 1e-9) {
        setValidity('Should be greater or equal than 1e-9');
      }
    }
  };

  const textFieldHandleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setValidity('Required');
    }
  };

  const selectHandleChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    const value = event.target.value;

    if (typeof value === 'string') {
      setCurrency(value);
      setBalance(currencies[value]);
    }
  };

  return (
    <Paper>
      <Block display="flex" flexDirection="column" alignItems="center" width="100%" padding={5}>
        <Avatar classes={avatarClasses}>
          <FontAwesomeIcon icon={faUser} color="#ffffff" />
        </Avatar>
        <Typography color="textPrimary" variant="subtitle2">
          You send
        </Typography>
        <Block display="flex" marginTop={5} marginBottom={1}>
          <Block marginRight={1}>
            <TextField
              placeholder="0,00"
              fullWidth
              onBlur={textFieldHandleBlur}
              onChange={textFieldHandleChange}
            />
          </Block>
          {/*TODO properly style Select component*/}
          <Select value={currency} onChange={selectHandleChange} autoWidth>
            {/* renderedCurrencies */}
            <MenuItem value="alt">ALT</MenuItem>
            <MenuItem value="iov">IOV</MenuItem>
          </Select>
        </Block>
        <Typography color="error" variant="subtitle2">
          {validity}
        </Typography>
        <Block marginTop={1}>
          <Typography color="textSecondary" variant="subtitle2">
            balance: {balance} {currency.toUpperCase()}
          </Typography>
        </Block>
      </Block>
    </Paper>
  );
};
