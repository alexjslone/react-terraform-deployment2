const fetch = require('node-fetch');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { itemName, category, price } = body;

    const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID&symbols=USD,THB';
    const response = await fetch(apiUrl);
    const data = await response.json();
    const exchangeRate = data.rates.THB;

    const priceInUSD = price / exchangeRate;

    const result = {
        itemName,
        category,
        price,
        totalInUSD: priceInUSD,
    };

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};
