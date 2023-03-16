const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*',
    baseUrl: "https://stripe-samples.github.io/github-pages-stripe-checkout/",
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeFlags: [
      "--enable-features=InterestCohortAPI"
    ],
    blockHosts: ['*google-analytics.com','*fls.doubleclick.net']
  },
});
