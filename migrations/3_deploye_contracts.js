const Items = artifacts.require("../contracts/Items");

module.exports = function (deployer) {
  deployer.deploy(Items);
};
