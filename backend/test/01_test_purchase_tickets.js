const Dhakon = artifacts.require("Dhakon");

/*
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Dhakon", (accounts) => {

  it("should return contract's balance", async() => {
    const dhakon = await Dhakon.deployed();
    const bal = await web3.eth.getBalance(dhakon.address);
    
    console.log("INITIAL BALANCE: ", bal);
    assert.equal(bal.toString(), "0", "Contract balance should be 0")
  })

  it("should keep FIRST player's address when buying a ticket", async() => {
    const dhakon = await Dhakon.deployed();
    
    await dhakon.enter({from: accounts[0], value: (0.11 * 10 ** 18).toString() });

    let countTickets = (await dhakon.getNumOfTickets()).toNumber();
    assert.equal(countTickets, 1, "There should be 1 ticket");

    let ticket = await dhakon.tickets(0);
    assert.ok(ticket, "Cannot get the ticket");
    assert.equal(ticket.player, accounts[0], "Ticket's player is not correct")

    let ticketNum = ticket.num.toString();
    let player = await dhakon.playerTickets(ticketNum);
    
    assert.equal(player, accounts[0], "Player's address is not correct");
  })

  it("should keep SECOND player's address when buying a ticket", async() => {
    const dhakon = await Dhakon.deployed();
    
    await dhakon.enter({from: accounts[1], value: (0.11 * 10 ** 18).toString() });

    let countTickets = (await dhakon.getNumOfTickets()).toNumber();
    assert.equal(countTickets, 2, "There should be 2 tickets");

    let ticket = await dhakon.tickets(1);
    assert.ok(ticket, "Cannot get the ticket");
    assert.equal(ticket.player, accounts[1], "Ticket's player is not correct")

    let ticketNum = ticket.num.toString();
    let player = await dhakon.playerTickets(ticketNum);
    
    assert.equal(player, accounts[1], "Player's address is not correct");
  })

  it("should have the correct balance", async() => {
    const dhakon = await Dhakon.deployed();
    const bal = await web3.eth.getBalance(dhakon.address);
    const bal1 = await dhakon.getBalance();

    assert.equal(bal, bal1, "Func getBalance didn't return correct balance");
    assert.equal(bal.toString(), (0.22 * 10 ** 18).toString(), "Contract balance is not correct");
    console.log("CURRENT BALANCE: ", web3.utils.fromWei(bal1, "ether"));
  })
});
