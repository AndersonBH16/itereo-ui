/* eslint-disable no-console */
function stringify(value) {
  return JSON.stringify(value, null, 2);
}

function runConsole(value, style) {
  console.log(`%c${value}`, style);
}

function normalizeValue(value) {
  const printValue = typeof value === "object" ? stringify(value) : value;
  return printValue;
}

const logger = {
  info(value) {
    runConsole(`${normalizeValue(value)}`, "color:green");
  },
};

export default logger;
