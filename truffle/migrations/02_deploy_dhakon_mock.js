const { BigNumber } = require("@ethersproject/bignumber");

const MockDhakon = artifacts.require("MockDhakon");

module.exports = function (deployer) {
  const callbackGasPrice = 1000000;   // Gas price limit for randomness callback (only change it if you know what you do!)

  const ticketPrice = 0.1;            // The price of 1 ticket to join
  const roundDays = 30;               // The round period (in days)
  const commissionPct = 300;           // commissionPct = Commission Percentage * 100 (eg. 1.23% -> 1.23 * 100 = 123)

  deployer.deploy(
    MockDhakon, 
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693",
    callbackGasPrice,
    BigNumber.from((ticketPrice * 10 ** 18).toString()),
    roundDays,
    commissionPct
  );
};
