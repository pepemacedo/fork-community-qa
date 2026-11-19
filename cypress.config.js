const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://URL-DO-SITE",
    viewportWidth: 1920,
    viewportHeight: 720,
    screenshotOnRunFailure: true,
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
