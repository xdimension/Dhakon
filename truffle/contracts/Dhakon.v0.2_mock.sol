// SPDX-License-Identifier: Proprietary

pragma solidity ^0.8.11;

import "./Dhakon.v0.2.sol";

contract MockDhakon is Dhakon {

    constructor(
        address _VRFCoordinator, 
        address _LINKToken, 
        bytes32 _keyHash,
        uint _VRFFee,
        uint _ticketPrice
    ) Dhakon(
        _VRFCoordinator, 
        _LINKToken, 
        _keyHash,
        _VRFFee,
        _ticketPrice
    ) {}

    function getRandomNumber() internal override returns(bytes32 requestId) {
        requestId = "1";
        fulfillRandomness(requestId, tickets.length + 1);  // select 2nd ticket as the winner
    }
} 