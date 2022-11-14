// SPDX-License-Identifier: Proprietary

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";


contract Dhakon is VRFV2WrapperConsumerBase {
    address owner;

    uint immutable public ticketPrice;
    uint16 immutable public roundDays;

    address[] public players;
    mapping(address => bool) checkPlayers;

    uint[] public tickets;          // array of ticket numbers
    mapping(uint => address payable) public playerTickets;   // ticket number => player's address

    struct Winner {
        uint ticket;
        address player;
        uint randRequestId;         // Randomness requestId
        uint paidAt;
    }

    Winner[] public winners;
    
    bool internal isPickingWinner;
    bool public isPausing;  // not accepting players when pausing
    uint32 public currentRound = 0;
    uint public roundEndsAt;

    uint32 internal callbackGasLimit;
    uint16 constant REQUEST_CONFIRMATIONS = 3;

    uint public lastRequestId;

    event NewPlayerEntered(uint indexed ticket, address indexed player);
    event RoundStarted(uint32 indexed round, uint roundEndsAt);
    event WinnerChosen(uint indexed ticket, address player);
    event WinnerPaid(uint indexed ticket, address player, uint paidAt);

    constructor(
        address _linkAddress, 
        address _wrapperAddress,
        uint32 _callbackGasLimit, 
        uint _ticketPrice,
        uint16 _roundDays)
        VRFV2WrapperConsumerBase(
            _linkAddress,              // LINK token address 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
            _wrapperAddress            // Mumbai VRF wrapper 0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693
        ) {
            callbackGasLimit = _callbackGasLimit;

            owner = msg.sender;
            ticketPrice = _ticketPrice;
            roundDays = _roundDays;
        }

    function getRandomNumber() internal virtual {
        uint requestId = requestRandomness(callbackGasLimit, REQUEST_CONFIRMATIONS, 1);    
        lastRequestId = requestId;
    }

    function fulfillRandomWords(uint requestId, uint256[] memory randomness) internal override {
        require(requestId == lastRequestId, "Invalid request");
        require(randomness[0] != 0, "Problem in getting randomness");

        uint index = randomness[0] % tickets.length;
        uint ticketNum = tickets[index];
        Winner memory winner = Winner(
            ticketNum, 
            playerTickets[ticketNum],
            requestId,
            0
        );

        winners.push(winner);
        emit WinnerChosen(winner.ticket, winner.player);

        isPickingWinner = false;
    }

    function generateTicket() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function getWinnerByRound(uint _round) public view returns (Winner memory) {
        if (_round == 0) {
            _round = currentRound + 1;
        }
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
        require(!isPausing, "The round is not in playing mode");
        require(msg.value >= ticketPrice, "Value is below Ticket Price");

        // save new ticket entering the round
        uint ticket = generateTicket();
        address payable player = payable(msg.sender);
        tickets.push(ticket);
        playerTickets[ticket] = player;

        addPlayers(player);
        emit NewPlayerEntered(ticket, player);

        // start the round when first ticket is added
        if (tickets.length == 1) {
            roundEndsAt = block.timestamp + (roundDays * 1 days);
            emit RoundStarted(currentRound + 1, roundEndsAt);
        }
    }

    function pickWinner() public onlyOwner {
        require(!isPickingWinner);
        require(roundEndsAt <= block.timestamp, "The round has not ended yet");
        require(tickets.length > 0, "There is no tickets yet");        
        require(winners.length <= currentRound, "The winner has been selected");

        isPickingWinner = true;
        isPausing = true;
        
        getRandomNumber();
    }

    function payWinner() public onlyOwner {
        require(winners.length > currentRound, "The winner hasn't been selected");  

        uint balance = address(this).balance;
        require(balance > 0, "There is no pot");

        uint ticketNum = winners[currentRound].ticket;
        address payable player = playerTickets[ticketNum];
        uint paidAt = block.timestamp;
        winners[currentRound].paidAt = paidAt;
        currentRound++;

        player.transfer(balance);

        emit WinnerPaid(ticketNum, player, paidAt);
        
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

        isPausing = false;
    }

    function withdrawLINKToken() external onlyOwner {
        uint balance = LINK.balanceOf(address(this));
        require(balance > 0, "LINK Balance is 0");
        
        LINK.transfer(owner, balance);
    }

    function setIsPickingWinner(bool _val) external onlyOwner {
        isPickingWinner = _val;
    }

    function setIsPausing(bool _val) external onlyOwner {
        isPausing = _val;
    }

    function setRoundEndsAt(uint _timestamp) external onlyOwner {
        roundEndsAt = _timestamp;
    }

    function getCallbackGasLimit() external view returns(uint32) {
        return callbackGasLimit;
    }

    function setCallbackGasLimit(uint32 _val) external onlyOwner {
        callbackGasLimit = _val;
    }

    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
}