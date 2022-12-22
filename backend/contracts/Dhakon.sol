// SPDX-License-Identifier: Proprietary

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract Dhakon is VRFV2WrapperConsumerBase, AutomationCompatibleInterface {
    address owner;

    uint immutable public ticketPrice;
    uint8 public roundDays;
    uint16 immutable public commissionPct;

    address[] public players;
    mapping(address => bool) checkPlayers;

    struct Ticket {
        uint32 num;
        uint time;
        address player;
    }

    Ticket[] public tickets;
    mapping(uint32 => address) public playerTickets;   // ticket number => player's address

    struct Winner {
        uint16 round;
        uint32 ticket;
        address player;
        uint randRequestId;         // Randomness requestId
        uint wonAt;
        uint paidAt;
    }

    Winner[] public winners;
    
    bool public isPickingWinner;
    bool public isPayingWinner;
    bool public isPaused;  // not accepting players when paused
    
    uint16 public currentRound = 0;
    uint public roundEndsAt;

    uint32 public callbackGasLimit;
    uint16 constant REQUEST_CONFIRMATIONS = 3;

    uint public lastRequestId;

    event NewPlayerEntered(uint32 indexed ticket, address indexed player);
    event RoundStarted(uint16 indexed round, uint8 nDays, uint endsAt);
    event WinnerChosen(uint32 indexed ticket, address player);
    event WinnerPaid(uint32 indexed ticket, address player, uint paidAt);

    constructor(
        address _linkAddress, 
        address _wrapperAddress,
        uint32 _callbackGasLimit, 
        uint _ticketPrice,
        uint8 _roundDays,
        uint16 _commissionPct
    )
    VRFV2WrapperConsumerBase(
        _linkAddress,              // LINK token address 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
        _wrapperAddress            // Mumbai VRF wrapper 0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693
    ) {
        callbackGasLimit = _callbackGasLimit;

        owner = msg.sender;
        ticketPrice = _ticketPrice;
        roundDays = _roundDays;
        commissionPct = _commissionPct;
    }

    function checkUpkeep(bytes calldata checkData) external view override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (keccak256(checkData) == keccak256(hex'01')) {
            upkeepNeeded = tickets.length > 0 && winners.length <= currentRound && roundEndsAt <= block.timestamp;
            performData = checkData;
            
        } else if (keccak256(checkData) == keccak256(hex'02')) {
            upkeepNeeded = winners.length > currentRound;
            performData = checkData;
        }
    }

    function performUpkeep(bytes calldata performData) external override 
    {
        if (keccak256(performData) == keccak256(hex'01')) {
            assert(winners.length <= currentRound && roundEndsAt <= block.timestamp);
            require(!isPickingWinner);
            pickWinner();

        } else if (keccak256(performData) == keccak256(hex'02')) {
            assert(winners.length > currentRound);
            payWinner();
        }
    }

    function getRandomNumber() internal virtual {
        uint requestId = requestRandomness(callbackGasLimit, REQUEST_CONFIRMATIONS, 1);    
        lastRequestId = requestId;
    }

    function fulfillRandomWords(uint requestId, uint256[] memory randomness) internal override {
        require(requestId == lastRequestId, "Invalid request");
        require(randomness[0] != 0, "Problem in getting randomness");

        uint index = randomness[0] % tickets.length;
        uint32 ticketNum = tickets[index].num;
        Winner memory winner = Winner({
            round: currentRound + 1,
            ticket: ticketNum, 
            player: playerTickets[ticketNum],
            randRequestId: requestId,
            wonAt: block.timestamp,
            paidAt: 0
        });

        winners.push(winner);
        emit WinnerChosen({
            ticket: winner.ticket, 
            player: winner.player
        });

        isPickingWinner = false;
    }

    function getWinners(uint32 limit) public view returns(Winner[] memory) {
        require(limit > 0, "Limit should be greater than 0");

        Winner[] memory lastWinners = new Winner[](limit);
        if (winners.length == 0) {
            return lastWinners;
        }

        uint8 idx1 = 1;
        uint idx2 = winners.length;

        while(idx1 <= limit && idx2 > 0) {
            lastWinners[idx1-1] = winners[idx2-1];
            idx1++; idx2--;
        }

        return lastWinners;
    }

    function getNumOfWinners() public view returns(uint) {
        return winners.length;
    }

    function getWinnerByRound(uint16 _round) public view returns (Winner memory) {
        if (_round == 0) {
            _round = currentRound + 1;
        }
        require(_round <= winners.length, "There is no such round");
        return winners[_round-1];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers(uint8 limit) public view returns(address[] memory) {
        require(limit > 0, "Limit should be greater than 0");

        address[] memory lastPlayers = new address[](limit);
        if (players.length == 0) {
            return lastPlayers;
        }
        
        uint8 idx1 = 1;
        uint idx2 = players.length;

        while(idx1 <= limit && idx2 > 0) {
            lastPlayers[idx1-1] = players[idx2-1];
            idx1++; idx2--;
        }

        return lastPlayers;
    }

    function getNumOfPlayers() public view returns (uint) {
        return players.length;
    }

    function getTickets(uint8 limit) public view returns(Ticket[] memory) {
        require(limit > 0, "Limit should be greater than 0");

        Ticket[] memory lastTickets = new Ticket[](limit);
        if (tickets.length == 0) {
            return lastTickets;
        }
        
        uint8 idx1 = 1;
        uint idx2 = tickets.length;

        while(idx1 <= limit && idx2 > 0) {
            lastTickets[idx1-1] = tickets[idx2-1];
            idx1++; idx2--;
        }

        return lastTickets;
    }

    function getNumOfTickets() public view returns(uint) {
        return tickets.length;
    }

    function addPlayer(address _address) internal {
        if (checkPlayers[_address] != true) {  // only add if player's address not yet exist
            checkPlayers[_address] = true;
            players.push(_address);
        }
    }

    function newTicket(address player) internal view returns (Ticket memory) {
        uint32 ticketNum = uint32(uint256(keccak256(abi.encodePacked(owner, block.timestamp))));
        return Ticket({
            num: ticketNum,
            time: block.timestamp,
            player: player
        });
    }

    function enter() public payable {
        require(!isPaused, "The round is not in playing mode");
        require(msg.value >= ticketPrice, "Value is below Ticket Price");

        // save new ticket entering the round
        address player = msg.sender;
        Ticket memory ticket = newTicket(player);
        tickets.push(ticket);
        playerTickets[ticket.num] = player;

        addPlayer(player);
        emit NewPlayerEntered({
            ticket: ticket.num, 
            player: ticket.player
        });

        // start the round when first ticket is added
        if (tickets.length == 1) {
            roundEndsAt = block.timestamp + (roundDays * 1 days);
            emit RoundStarted({
                round: currentRound + 1,
                nDays: roundDays,
                endsAt: roundEndsAt
            });
        }
    }

    function pickWinner() public {
        require(!isPickingWinner);
        require(roundEndsAt <= block.timestamp, "The round has not ended yet");
        require(tickets.length > 0, "There is no tickets yet");        
        require(winners.length <= currentRound, "The winner has been determined");

        isPickingWinner = true;
        isPaused = true;
        
        getRandomNumber();
    }

    function payWinner() public {
        require(!isPayingWinner);
        require(winners.length > currentRound, "The winner has not been determined");  

        isPayingWinner = true;
        uint balance = address(this).balance;
        require(balance > 0, "The pot is empty");

        uint32 ticketNum = winners[currentRound].ticket;
        address payable player = payable(playerTickets[ticketNum]);
        address payable holder = payable(owner);
        uint paidAt = block.timestamp;
        winners[currentRound].paidAt = paidAt;
        currentRound++;

        uint commissionAmt = commissionPct * balance / 10000;
        uint playerPrize = balance - commissionAmt;

        player.transfer(playerPrize);
        holder.transfer(commissionAmt);

        isPayingWinner = false;
        emit WinnerPaid({
            ticket: ticketNum, 
            player: player, 
            paidAt: paidAt
        });
        
        // reset the state of the contract for new round
        resetRound();
    }

    function resetRound() internal {        
        for(uint i=0; i < players.length; i++) {
            delete checkPlayers[players[i]]; 
        }
        delete players;

        for(uint i=0; i < tickets.length; i++) {
            delete playerTickets[tickets[i].num];
        }
        delete tickets;

        isPaused = false;
    }

    function withdrawLINKToken() external onlyOwner {
        uint balance = LINK.balanceOf(address(this));
        require(balance > 0, "LINK Balance is 0");
        
        LINK.transfer(owner, balance);
    }

    function setRoundDays(uint8 _roundDays) external onlyOwner {
        roundDays = _roundDays;
    }

    function setRoundEndsAt(uint _timestamp) external onlyOwner {
        roundEndsAt = _timestamp;
    }

    function setIsPickingWinner(bool _val) external onlyOwner {
        isPickingWinner = _val;
    }

    function setIsPayingWinner(bool _val) external onlyOwner {
        isPayingWinner = _val;
    }

    function setIsPaused(bool _val) external onlyOwner {
        isPaused = _val;
    }

    function setCallbackGasLimit(uint32 _val) external onlyOwner {
        callbackGasLimit = _val;
    }

    function isOwner(address _address) public view returns(bool) {
        return (_address == owner);
    }

    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }
}