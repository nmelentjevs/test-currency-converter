import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { currencies } from '../utils/getCountryCurrency';
import { countryToFlag } from '../utils/countryToFlag';

const useStyles = makeStyles((theme) => ({
  inputs: {
    padding: theme.spacing(7),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
  },
  converter: {
    borderRadius: 10,
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
}));

export enum InputType {
  choose = 'choose',
  base = 'base',
}

interface ExchangeInputProps {
  toCurrency: string;
  setToCurrency: Function;
  swapped: Boolean;
}

const ExchangeInput: FC<ExchangeInputProps> = ({
  toCurrency,
  setToCurrency,
  swapped,
}) => {
  const classes = useStyles();

  return (
    <Autocomplete
      id="country-select-demo"
      style={{ width: 200 }}
      options={currencies.filter((curr) => curr.currencyCode !== 'USD')}
      classes={{
        option: classes.option,
      }}
      autoHighlight
      onChange={(e, value) =>
        value ? setToCurrency(value.currencyCode) : setToCurrency('EUR')
      }
      defaultValue={{
        currencyCode: toCurrency || 'EUR',
        name: 'Spain',
      }}
      getOptionSelected={(option) =>
        option.currencyCode === (toCurrency || 'EUR')
      }
      getOptionLabel={(option) => option.currencyCode}
      renderOption={(option) => (
        <React.Fragment>
          <span>{countryToFlag(option.alpha2)}</span>
          {option.name} ({option.currencyCode})
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose currency"
          variant="outlined"
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
    />
  );
};

interface BaseInputProps {
  amount: Number;
  setAmount: Function;
  swapped: Boolean;
  toCurrency: string;
}

const BaseInput: FC<BaseInputProps> = ({
  amount,
  setAmount,
  swapped,
  toCurrency,
}) => {
  return (
    <TextField
      id="outlined-basic"
      label={swapped ? 'USD' : toCurrency}
      variant="outlined"
      placeholder={swapped ? 'Enter USD amount' : `Enter ${toCurrency} amount`}
      defaultValue={amount === 0 ? undefined : amount}
      onChange={(e) => setAmount(e.target.value)}
      style={{ width: 200 }}
    />
  );
};

export { BaseInput, ExchangeInput };
