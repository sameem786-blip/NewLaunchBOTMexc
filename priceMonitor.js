const WebSocket = require("ws");
const logToFile = require("./logger");
const { PROFIT_TARGET, STOP_LOSS } = require("./config");
const placeOrder = require("./order");

/**
 * Monitor live prices of a coin
 */
async function monitorPrice(pair, entryPrice) {
  logToFile(`Monitoring ${pair} for profit target or stop loss...`);
  const ws = new WebSocket(`wss://wbs.mexc.com/ws`);

  ws.on("open", () => {
    ws.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: [`${pair.toLowerCase()}@trade`],
        id: 1,
      })
    );
  });

  ws.on("message", async (data) => {
    const parsed = JSON.parse(data);
    if (parsed.e === "trade") {
      const price = parseFloat(parsed.p);
      const profit = (price - entryPrice) / entryPrice;
      logToFile(
        `Current Price: ${price}, Profit: ${(profit * 100).toFixed(2)}%`
      );

      if (profit >= PROFIT_TARGET) {
        logToFile(`Target profit reached! Selling ${pair}...`);
        await placeOrder("SELL", pair, INVESTMENT);
        process.exit();
      } else if (profit <= -STOP_LOSS) {
        logToFile(`Stop-loss triggered! Selling ${pair}...`);
        await placeOrder("SELL", pair, INVESTMENT);
        process.exit();
      }
    }
  });

  ws.on("error", (error) => logToFile(`WebSocket error: ${error.message}`));
}

module.exports = monitorPrice;
