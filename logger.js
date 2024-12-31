const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "bot_log.txt");

/**
 * Append logs to a log file with timestamps.
 * @param {string} message - The message to log.
 */
function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim()); // Also log to console
  fs.appendFileSync(LOG_FILE, logMessage, "utf8");
}

module.exports = logToFile;
