const { BigNumber } = require("@ethersproject/bignumber");

const MockDhakon = artifacts.require("MockDhakon");

module.exports = function (deployer) {
  deployer.deploy(
    MockDhakon, 
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693",
    1000000,
    BigNumber.from((0.1 * 10 ** 18).toString())
  );
};
