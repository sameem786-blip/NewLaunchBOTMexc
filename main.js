const fetchUpcomingListings = require("./scraper");
const placeOrder = require("./order");
const monitorPrice = require("./priceMonitor");
const logToFile = require("./logger");

async function runBot() {
  logToFile("Fetching upcoming coin launches...");
  const listings = await fetchUpcomingListings();

  if (listings.length === 0) {
    logToFile("No upcoming launches found. Exiting...");
    return;
  }

  // Filter and sort listings to find the next coin to launch
  const now = new Date();
  const upcomingListings = listings
    .filter((listing) => new Date(listing.listingTime) > now) // Only future launches
    .sort((a, b) => new Date(a.listingTime) - new Date(b.listingTime)); // Sort by soonest launch time

  if (upcomingListings.length === 0) {
    logToFile("All listed coins have already launched. Exiting...");
    return;
  }

  const nextCoin = upcomingListings[0]; // The next coin to launch
  const pair = `${nextCoin.coinName.toUpperCase()}USDT`;
  const listingTime = new Date(nextCoin.listingTime);

  logToFile(`Selected coin: ${nextCoin.coinName}`);
  logToFile(`Listing time: ${listingTime}`);

  const timeUntilLaunch = listingTime - now;

  if (timeUntilLaunch > 0) {
    logToFile(
      `Waiting ${timeUntilLaunch / 1000} seconds until the coin launches...`
    );
    await new Promise((resolve) => setTimeout(resolve, timeUntilLaunch));
  } else {
    logToFile("The coin is already live. Skipping BUY...");
    return;
  }

  logToFile(`Placing BUY order for ${pair}...`);
  const response = await placeOrder("BUY", pair);

  if (response) {
    logToFile(
      `Successfully bought ${pair}. Starting monitoring for profit/loss...`
    );
    await monitorPrice(pair, parseFloat(response.price || 0));
  } else {
    logToFile("Failed to place BUY order. Exiting...");
  }
}

runBot().catch((error) =>
  logToFile(`Bot encountered an error: ${error.message}`)
);
