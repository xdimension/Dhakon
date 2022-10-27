// SPDX-License-Identifier: Proprietary

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";


contract Dhakon is VRFV2WrapperConsumerBase {
    address owner;

    uint ticketPrice;

    address[] public players;
    mapping(address => bool) checkPlayers;

    uint[] public tickets;          // array of ticket's number
    mapping(uint => address payable) public playerTickets;   // ticketNum => player's address

    struct PlayerTicket {
        uint ticket;
        address player;
        uint randRequestId;         // Randomness requestId
    }

    PlayerTicket[] public winners;
    bool internal isPickingWinner;

    uint32 public callbackGasLimit;
    uint16 constant REQUEST_CONFIRMATIONS = 3;

    uint public lastRequestId;

    constructor(
        address _linkAddress, 
        address _wrapperAddress,
        uint32 _callbackGasLimit, 
        uint _ticketPrice)
        VRFV2WrapperConsumerBase(
            _linkAddress,              // LINK token address 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
            _wrapperAddress            // Mumbai VRF wrapper 0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693
        ) {
            callbackGasLimit = _callbackGasLimit;

            owner = msg.sender;
            ticketPrice = _ticketPrice;
        }

    function getRandomNumber() internal virtual {
        uint requestId = requestRandomness(callbackGasLimit, REQUEST_CONFIRMATIONS, 1);    
        lastRequestId = requestId;
    }

    function fulfillRandomWords(uint requestId, uint256[] memory randomness) internal override {
        require(randomness[0] != 0, "Problem in getting randomness");

        uint index = randomness[0] % tickets.length;
        uint ticketNum = tickets[index];
        
        winners.push(PlayerTicket(
            ticketNum, 
            playerTickets[ticketNum],
            requestId
        ));
    
        isPickingWinner = false;
    }

    function generateTicket() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function getWinnerByRound(uint _round) public view returns (PlayerTicket memory) {
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

    function pickWinner() public onlyOwner {
        require(tickets.length > 0, "There is no tickets yet");        
        require(!isPickingWinner);
        isPickingWinner = true;
        
        getRandomNumber();
    }

    function payWinner() public onlyOwner {
        assert(winners.length > 0);

        uint ticketNum = winners[winners.length-1].ticket;
        playerTickets[ticketNum].transfer(address(this).balance);
        
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

    function withdrawLINKToken() external onlyOwner {
        uint balance = LINK.balanceOf(address(this));
        require(balance > 0, "Balance is 0");
        
        LINK.transfer(owner, balance);
    }

    function setIsPickingWinner(bool _val) external onlyOwner {
        isPickingWinner = _val;
    }

    function setCallbackGasLimit(uint32 _val) external onlyOwner {
        callbackGasLimit = _val;
    }

    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
}