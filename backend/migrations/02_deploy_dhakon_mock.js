const { BigNumber } = require("@ethersproject/bignumber");

const MockDhakon = artifacts.require("MockDhakon");

const _config_ = require("../config").config

module.exports = function (deployer) {
  deployer.deploy(
    MockDhakon, 
    _config_.LINKTokenAddress,
    _config_.VRFWrapperAddress,
    _config_.callbackGasPrice,
    BigNumber.from((_config_.ticketPrice * 10 ** 18).toString()),
    _config_.roundDays,
    _config_.commissionPct
  );
};
