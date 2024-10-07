const Products = artifacts.require("../contracts/Products");

module.exports = function (deployer) {
  deployer.deploy(Products);
};
