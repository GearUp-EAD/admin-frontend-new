import { defineConfig } from "cypress";

const config = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173'
  }
});

export default config;