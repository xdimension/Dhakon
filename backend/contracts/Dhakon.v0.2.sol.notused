// SPDX-License-Identifier: Proprietary

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract Dhakon is VRFConsumerBase {
    address owner;

    uint ticketPrice;

    address[] public players;
    mapping(address => bool) checkPlayers;

    uint[] public tickets;
    mapping(uint => address payable) public playerTickets;

    struct playerTicket {
        uint ticket;
        address player;
    }

    playerTicket[] public winners;
    bool public isPickingWinner;

    bytes32 internal keyHash; // identifies which Chainlink oracle to use
    uint internal VRFFee;        // fee to get random number

    constructor(
        address _VRFCoordinator, 
        address _LINKToken, 
        bytes32 _keyHash,
        uint _VRFFee,
        uint _ticketPrice)
        VRFConsumerBase(
            _VRFCoordinator,        // Mumbai VRF coordinator 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
            _LINKToken              // LINK token address 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
        ) {
            keyHash = _keyHash;     // 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
            VRFFee = _VRFFee;  // 0.0001 * 10 ** 18;    // 0.0001 LINK (Mumbai)

            owner = msg.sender;
            ticketPrice = _ticketPrice;
        }

    function getRandomNumber() internal virtual returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= VRFFee, "Not enough LINK in contract");
        return requestRandomness(keyHash, VRFFee);
    }

    function fulfillRandomness(bytes32 requestId, uint randomness) internal override {
        uint index = randomness % tickets.length;
        payWinner(index);
        isPickingWinner = false;
    }

    function generateTicket() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function getWinnerByRound(uint _round) public view returns (playerTicket memory) {
        require(_round <= winners.length, "There is no such round");
        return winners[_round-1];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function getNumOfPlayers() public view returns (uint) {
        return players.length;
    }

    function getNumOfTickets() public view returns(uint) {
        return tickets.length;
    }

    function addPlayers(address playerAddr) internal {
        if (checkPlayers[playerAddr] != true) {  // only add if player's address not yet exist
            checkPlayers[playerAddr] = true;
            players.push(playerAddr);
        }
    }

    function enter() public payable {
        require(msg.value >= ticketPrice, "Value is below Ticket Price");

        // save new ticket entering the round
        uint ticket = generateTicket();
        address payable player = payable(msg.sender);
        tickets.push(ticket);
        playerTickets[ticket] = player;

        addPlayers(player);
    }

    function pickWinner() public onlyowner {
        require(tickets.length > 0, "There is no tickets yet");        
        require(!isPickingWinner);
        isPickingWinner = true;
        
        getRandomNumber();
    }

    function payWinner(uint ticketIdx) internal {
        uint ticketNum = tickets[ticketIdx];
        playerTickets[ticketNum].transfer(address(this).balance);

        winners.push(playerTicket(
            ticketNum, 
            playerTickets[ticketNum]
        ));
        
        // reset the state of the contract
        resetRound();
    }

    function resetRound() internal {        
        for(uint i=0;i<players.length;i++) {
            delete checkPlayers[players[i]]; 
        }
        players = new address payable[](0);

        for(uint i=0;i<tickets.length;i++) {
            delete playerTickets[tickets[i]];
        }
        tickets = new uint[](0);
    }

    function withdrawLINKToken() external onlyowner {
        uint balance = LINK.balanceOf(address(this));
        require(balance > 0, "Balance is 0");
        
        LINK.transfer(owner, balance);
    }

    function setIsPickingWinner(bool _val) external onlyowner {
        isPickingWinner = _val;
    }

    modifier onlyowner() {
      require(msg.sender == owner);
      _;
    }
}