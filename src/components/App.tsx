import React, { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { secrets } from '../config';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { ExchangeInput, BaseInput } from './ExchangeInput';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import FullScreenLoading from './FullScreenLoading';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme) => ({
  inputs: {
    padding: theme.spacing(5),
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  montserrat: {
    fontFamily: 'Montserrat',
  },
  refresh: {
    dispay: 'flex',
    alignItems: 'center',
  },
}));

const Converter: FC = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState<Boolean>(true);
  const [swapped, setSwapped] = useState<Boolean>(true);
  const [rates, setRates] = useState<{}>({});
  const [amount, setAmount] = useState<number>(0);
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  useEffect(() => {
    getCurrentExchangeRates().then((_) => {
      setTimeout(() => setLoading(false), 500);
    });
  }, []);

  const getCurrentExchangeRates = async () => {
    const ratesApi = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${secrets.openExchangeRatesApiKey}`
    );
    setRates(ratesApi.data.rates);
  };

  const swapExchangeInputs = () => {
    setSwapped(!swapped);
  };

  const calculateRate = (baseAmount: number, currency: string) => {
    const rate: number =
      rates[Object.keys(rates).find((exch: string) => exch === currency)!];

    return swapped
      ? (baseAmount * rate).toFixed(2)
      : (baseAmount / rate).toFixed(2);
  };

  const renderExchangeInput = () => (
    <ExchangeInput
      toCurrency={toCurrency}
      setToCurrency={setToCurrency}
      swapped={swapped}
    />
  );
  const renderBaseInput = () => (
    <BaseInput
      amount={amount}
      setAmount={setAmount}
      swapped={swapped}
      toCurrency={toCurrency}
    />
  );

  return (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.converter}>
        <Typography variant="h4" className={classes.montserrat}>
          Currency rates
        </Typography>
        {loading ? (
          <FullScreenLoading fit />
        ) : (
          <Fade in={!loading}>
            <form className={classes.inputs} noValidate autoComplete="off">
              {swapped ? renderBaseInput() : renderExchangeInput()}
              <Tooltip title="Swap">
                <IconButton aria-label="swap" onClick={swapExchangeInputs}>
                  <SwapHorizIcon fontSize="default" style={{ margin: 10 }} />
                </IconButton>
              </Tooltip>
              {swapped ? renderExchangeInput() : renderBaseInput()}
            </form>
          </Fade>
        )}
        <Typography variant="h6" className={classes.montserrat}>
          {amount} {swapped ? 'USD' : toCurrency} equals
        </Typography>
        <Typography
          variant="h6"
          className={(classes.montserrat, classes.refresh)}
        >
          ~ {calculateRate(amount, toCurrency)} {swapped ? toCurrency : 'USD'}
          <Tooltip title="Refresh">
            <IconButton aria-label="swap" onClick={getCurrentExchangeRates}>
              <RefreshIcon fontSize="default" />
            </IconButton>
          </Tooltip>
        </Typography>
      </Paper>
    </div>
  );
};

export default Converter;
