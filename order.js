const axios = require("axios");
const logToFile = require("./logger");
const { BASE_URL, INVESTMENT } = require("./config");

/**
 * Place buy/sell orders with MEXC API
 */
async function placeOrder(side, pair, quantity = INVESTMENT) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v3/order`,
      {
        symbol: pair,
        side: side.toUpperCase(),
        type: "MARKET",
        quantity,
      },
      {
        headers: {
          "X-MEXC-APIKEY": process.env.MEXC_API_KEY,
        },
      }
    );
    logToFile(`${side} Order successful: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    logToFile(`${side} Order failed: ${error.response?.data || error.message}`);
    return null;
  }
}

module.exports = placeOrder;
