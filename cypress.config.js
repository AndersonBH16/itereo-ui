const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    testIsolation: false,
  },
  viewportWidth: 1350,
  viewportHeight: 800,
});
