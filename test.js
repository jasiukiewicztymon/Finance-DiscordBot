var util = require('util');

const yahooFinance = require('yahoo-finance')

var SYMBOL = 'EURCHF=X';

yahooFinance.historical({
  symbol: SYMBOL,
  from: '2012-01-01',
  to: '2013-01-04',
  period: 'w'
}, function (err, quotes) {
  if (err) { throw err; }
  console.log(util.format(
    '=== %s (%d) ===',
    SYMBOL,
    quotes.length
  ).cyan);
  if (quotes[0]) {
    console.log(
      '%s\n...\n%s',
      JSON.stringify(quotes[0], null, 2),
      JSON.stringify(quotes[1], null, 2)
    );
  } else {
    console.log('N/A');
  }
});