// SPDX-License-Identifier: Proprietary

pragma solidity ^0.8.11;

import "./Dhakon.v0.3.sol";

contract MockDhakon is Dhakon {

    constructor(
        address _linkAddress, 
        address _wrapperAddress, 
        uint32 _callbackGasLimit,
        uint _ticketPrice
    ) Dhakon(
        _linkAddress, 
        _wrapperAddress, 
        _callbackGasLimit,
        _ticketPrice
    ) {}

    function getRandomNumber() internal override {
        uint requestId = 1;
        lastRequestId = requestId;
        
        uint256[] memory randomness = new uint[](1);
        randomness[0] = tickets.length + 1;

        fulfillRandomWords(requestId, randomness);  // select 2nd ticket as the winner
    }
} 