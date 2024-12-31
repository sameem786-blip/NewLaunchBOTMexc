const path = require("path");

module.exports = {
  MEXC_NEW_LISTING_URL: "https://www.mexc.com/newlisting",
  BASE_URL: "https://api.mexc.com",
  INVESTMENT: 4, // USD to invest per trade
  PROFIT_TARGET: 0.3, // 30% profit target
  STOP_LOSS: 0.05, // 5% stop loss
  LOG_FILE: path.join(__dirname, "bot_log.txt"), // Log file path
};
