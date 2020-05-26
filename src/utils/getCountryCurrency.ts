import LocaleCurrency from 'locale-currency';
import cc from 'country-code';
import _ from 'lodash';

const currencies = associateCurrencies(countriesWithCurrency(cc.countries));

function associateCurrencies(countries) {
  return _.map(countries, (country) => ({
    ...country,
    currencyCode: LocaleCurrency.getCurrency(country.alpha2),
  }));
}

function countriesWithCurrency(countries) {
  return _.filter(
    countries,
    (country) => !!LocaleCurrency.getCurrency(country.alpha2)
  );
}

export { currencies };
