const { BigNumber } = require("@ethersproject/bignumber");

const Dhakon = artifacts.require("Dhakon");

const _config_ = require("../config").config

module.exports = function (deployer) {
  deployer.deploy(
    Dhakon, 
    _config_.LINKTokenAddress,
    _config_.VRFWrapperAddress,
    _config_.callbackGasPrice,
    BigNumber.from((_config_.ticketPrice * 10 ** 18).toString()),
    _config_.roundDays,
    _config_.commissionPct
  );
};
