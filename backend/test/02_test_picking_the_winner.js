const MockDhakon = artifacts.require("MockDhakon");

/*
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MockDhakon", async(accounts) => {

  it("should return contract's balance", async() => {
    const dhakon = await MockDhakon.deployed();
    const bal = await web3.eth.getBalance(dhakon.address);
    
    console.log("INITIAL BALANCE: ", bal);
    assert.equal(bal.toString(), "0", "Contract balance should be 0")
  })

  it("should keep FIRST player's address when buying a ticket", async() => {
    const dhakon = await MockDhakon.deployed();
    
    await dhakon.enter({from: accounts[0], value: (0.11 * 10 ** 18).toString() });

    let countTickets = (await dhakon.getNumOfTickets()).toNumber();
    assert.equal(countTickets, 1, "Number of tickets is not equal 1");

    let countPlayers = (await dhakon.getNumOfPlayers()).toNumber();
    assert.equal(countPlayers, 1, "Number of players is not equal 1")

    let ticket = await dhakon.tickets(0);
    assert.ok(ticket, "Cannot get the ticket");

    let ticketNum = ticket.num.toString();
    let player = await dhakon.playerTickets(ticketNum);
    
    assert.equal(player, accounts[0], "Player's address is not correct");
  })

  it("should keep SECOND player's address when buying the FIRST ticket", async() => {
    const dhakon = await MockDhakon.deployed();
    
    await dhakon.enter({from: accounts[1], value: (0.11 * 10 ** 18).toString() });

    let countTickets = (await dhakon.getNumOfTickets()).toNumber();
    assert.equal(countTickets, 2, "Number of tickets is not equal 2");

    let countPlayers = (await dhakon.getNumOfPlayers()).toNumber();
    assert.equal(countPlayers, 2, "Number of players is not equal 2")


    let ticket = await dhakon.tickets(1);
    assert.ok(ticket, "Cannot get the ticket");

    let ticketNum = ticket.num.toString();
    let player = await dhakon.playerTickets(ticketNum);
    
    assert.equal(player, accounts[1], "Player's address is not correct");
  })

  it("should keep SECOND player's ticket when buying the SECOND ticket", async() => {
    const dhakon = await MockDhakon.deployed();
    
    await dhakon.enter({from: accounts[1], value: (0.11 * 10 ** 18).toString() });

    let countTickets = (await dhakon.getNumOfTickets()).toNumber();
    assert.equal(countTickets, 3, "Number of tickets is not equal 3");

    let countPlayers = (await dhakon.getNumOfPlayers()).toNumber();
    assert.equal(countPlayers, 2, "Number of players is not equal 2")

    let ticket = await dhakon.tickets(2);
    assert.ok(ticket, "Cannot get the ticket");
    
    let ticketNum = ticket.num.toString();
    let player = await dhakon.playerTickets(ticketNum);
    
    assert.equal(player, accounts[1], "Player's address is not correct");
  })

  it("should have correct balance", async() => {
    const dhakon = await MockDhakon.deployed();
    const bal = await web3.eth.getBalance(dhakon.address);
    const bal1 = await dhakon.getBalance();

    assert.equal(bal, bal1, "Func getBalance didn't return correct balance");
    assert.equal(bal.toString(), (0.33 * 10 ** 18).toString(), "Contract balance is not correct");
    console.log("CURRENT BALANCE: ", web3.utils.fromWei(bal1, "ether"));
  })

  it("should check the round period", async() => {
    const dhakon = await MockDhakon.deployed();
    
    let errMsg = null
    try {
      await dhakon.pickWinner();
    } catch (err) {
      errMsg = err.reason;
    }

    assert.equal(errMsg, "The round has not ended yet", "Round period was not checked")
  })

  it("should be able to pick the winner", async() => {
    const dhakon = await MockDhakon.deployed();

    // set the round to end now
    await dhakon.setRoundEndsAt(Math.floor(new Date().getTime() / 1000));

    // let's become God who determines the future
    // the winning ticket is the second entry, selected in mocked contract
    let ticket = await dhakon.tickets(1);
    assert.ok(ticket, "Cannot get the ticket");

    let winningTicket = ticket.num;
    let winningPlayer = await dhakon.playerTickets(winningTicket);

    await dhakon.pickWinner();

    let winner = await dhakon.getWinnerByRound(1);

    assert.equal(winner.ticket, winningTicket, "Winning ticket is not correct");
    assert.equal(winner.player, winningPlayer, "Winning player is not correct");
  })

  it("getWinners should return correct result", async() => {
    const dhakon = await MockDhakon.deployed();

    // the winning ticket is the second entry, selected in mocked contract
    let ticket = await dhakon.tickets(1);
    let lastWinners = await dhakon.getWinners(1);

    assert.equal(lastWinners[0].ticket, ticket.num, "Winners[0].ticket is not correct")
  })

  it("should be able to pay the winner", async() => {
    const dhakon = await MockDhakon.deployed();

    await dhakon.payWinner();

    let winner = await dhakon.getWinnerByRound(1);

    assert.notEqual(winner.paidAt, "0", "Player's paid time has not been updated");

    let countPlayers = await dhakon.getNumOfPlayers();
    let countTickets = await dhakon.getNumOfTickets();

    assert.equal(countPlayers, "0", "Players has not been cleared");
    assert.equal(countTickets, "0", "Tickets has not been cleared");
  })

  it("balance should be 0", async() => {
    const dhakon = await MockDhakon.deployed();
    
    const bal1 = await dhakon.getBalance();

    assert.equal(bal1.toString(), "0", "End balance is not 0");
    console.log("END BALANCE: ", web3.utils.fromWei(bal1, "ether"));
  })

});