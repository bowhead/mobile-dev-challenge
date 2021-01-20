const BowheadDevChallenge = artifacts.require("BowheadDevChallenge");

module.exports = function (deployer) {
  deployer.deploy(BowheadDevChallenge);
};
