const backendModule = require("../dist/app");

const app = backendModule.default || backendModule.app || backendModule;
const initializeApp = backendModule.initializeApp;

module.exports = async (req, res) => {
  if (typeof initializeApp === "function") {
    await initializeApp();
  }

  return app(req, res);
};
