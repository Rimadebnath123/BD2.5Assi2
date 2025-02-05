const express = require('express');
const { resolve } = require('path');
const stocks = require('./stocks');

let cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

app.get('/stocks', (req, res) => {
  res.json(stocks);
});

// Function to sort stocks by price
function sortStocksByPrice(stock1, stock2, order) {
  return order === 'high-to-low'
    ? stock2.price - stock1.price
    : stock1.price - stock2.price;
}

app.get('/stocks/sort/pricing', (req, res) => {
  let pricing = req.query.order || 'high-to-low';
  let sortedStocks = stocks
    .slice()
    .sort((a, b) => sortStocksByPrice(a, b, pricing));
  res.json(sortedStocks);
});

// Function to sort stocks by growth
function sortStocksByGrowth(stock1, stock2, order) {
  return order === 'high-to-low'
    ? stock2.growth - stock1.growth
    : stock1.growth - stock2.growth;
}

app.get('/stocks/sort/growth', (req, res) => {
  let growth = req.query.order || 'high-to-low'; // Default to high-to-low
  let sortedStocks = stocks
    .slice()
    .sort((a, b) => sortStocksByGrowth(a, b, growth));

  res.json(sortedStocks);
});

// Function to filter stocks by exchange
function filterByExchange(stock, selectedExchange) {
  return stock.exchange.toLowerCase() === selectedExchange.toLowerCase();
}

app.get('/stocks/filter/exchange', (req, res) => {
  let selectedExchange = req.query.exchange;
  let filteredStocks = stocks.filter((stock) =>
    filterByExchange(stock, selectedExchange)
  );

  res.json(filteredStocks);
});
//stocks/filter/exchange?exchange=NSE

// Function to filter stocks by Industry
function filterByIndustry(stock, selectedIndustry) {
  return stock.industry.toLowerCase() === selectedIndustry.toLowerCase();
}

app.get('/stocks/filter/industry', (req, res) => {
  let selectedIndustry = req.query.industry;
  let filteredStocks = stocks.filter((stock) =>
    filterByIndustry(stock, selectedIndustry)
  );

  res.json(filteredStocks);
});
//http://localhost:3000/stocks/filter/industry?industry=Finance

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
