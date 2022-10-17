const { BigNumber } = require("@ethersproject/bignumber");

const MockDhakon = artifacts.require("MockDhakon");

module.exports = function (deployer) {
  deployer.deploy(
    MockDhakon, 
    "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
    "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    BigNumber.from((0.0001 * 10 ** 18).toString()),
    BigNumber.from((0.1 * 10 ** 18).toString())
  );
};
