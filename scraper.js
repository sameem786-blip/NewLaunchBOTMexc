const axios = require("axios");
const cheerio = require("cheerio");
const logToFile = require("./logger");
const { MEXC_NEW_LISTING_URL } = require("./config");

/**
 * Fetch upcoming coin listings from MEXC New Listing Calendar
 */
async function fetchUpcomingListings() {
  logToFile("Fetching MEXC listings with axios and Cheerio...");

  try {
    const response = await axios.get(MEXC_NEW_LISTING_URL);
    const html = response.data;
    const $ = cheerio.load(html);

    const listings = [];
    $(".content_listBox__9o_0m .card_container___xZkC").each((_, element) => {
      const coinName = $(element)
        .find(".name.card_withEllipsis__pZ_OY")
        .text()
        .trim();
      const description = $(element)
        .find(".description.card_withEllipsis__pZ_OY")
        .text()
        .trim();
      const listingTime = $(element)
        .find("div:contains('Listing Time') + div")
        .text()
        .trim()
        .replace(/[^0-9 :-]/g, "");

      if (coinName && listingTime) {
        listings.push({ coinName, description, listingTime });
      }
    });

    logToFile(`Extracted ${listings.length} listings.`);
    return listings;
  } catch (error) {
    logToFile(`Error fetching listings: ${error.message}`);
    return [];
  }
}

module.exports = fetchUpcomingListings;
