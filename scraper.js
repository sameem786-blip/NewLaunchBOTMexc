const puppeteer = require("puppeteer");
const logToFile = require("./logger");
const { MEXC_NEW_LISTING_URL } = require("./config");

/**
 * Fetch upcoming coin listings from MEXC New Listing Calendar
 */
async function fetchUpcomingListings() {
  logToFile("Launching Puppeteer to fetch MEXC listings...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(MEXC_NEW_LISTING_URL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    logToFile("Page loaded. Extracting listings...");

    await page.waitForSelector(".content_listBox__9o_0m", { timeout: 30000 });

    const listings = await page.evaluate(() => {
      const cards = document.querySelectorAll(
        ".content_listBox__9o_0m .card_container___xZkC"
      );
      const extractedListings = [];

      cards.forEach((card) => {
        const coinNameElement = card.querySelector(
          ".name.card_withEllipsis__pZ_OY"
        );
        const descriptionElement = card.querySelector(
          ".description.card_withEllipsis__pZ_OY"
        );
        const listingTimeText = document
          .evaluate(
            './/div[contains(text(), "Listing Time")]/following-sibling::div',
            card,
            null,
            XPathResult.STRING_TYPE,
            null
          )
          .stringValue.trim();

        if (coinNameElement && listingTimeText) {
          extractedListings.push({
            coinName: coinNameElement.textContent.trim(),
            description: descriptionElement?.textContent.trim(),
            listingTime: listingTimeText.replace(/[^0-9 :-]/g, ""),
          });
        }
      });

      return extractedListings;
    });

    logToFile(`Extracted ${listings.length} listings.`);
    console.log("Listings: ", listings);
    await browser.close();
    return listings;
  } catch (error) {
    logToFile(`Error fetching listings: ${error.message}`);
    await browser.close();
    return [];
  }
}

module.exports = fetchUpcomingListings;
