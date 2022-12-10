// SPDX-License-Identifier: Proprietary

pragma solidity ^0.8.11;

import "./Dhakon.sol";

contract MockDhakon is Dhakon {

    constructor(
        address _linkAddress, 
        address _wrapperAddress, 
        uint32 _callbackGasLimit,
        uint _ticketPrice,
        uint8 _roundDays,
        uint16 _commissionPct
    ) Dhakon(
        _linkAddress, 
        _wrapperAddress, 
        _callbackGasLimit,
        _ticketPrice,
        _roundDays,
        _commissionPct
    ) {}

    function getRandomNumber() internal override {
        uint requestId = 1;
        lastRequestId = requestId;
        
        uint256[] memory randomness = new uint[](1);
        randomness[0] = tickets.length + 1;

        fulfillRandomWords(requestId, randomness);  // select 2nd ticket as the winner
    }

    function setRoundEndsAt(uint _timestamp) external onlyOwner {
        roundEndsAt = _timestamp;
    }

} 