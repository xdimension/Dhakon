exports.config = {

    ticketPrice: 0.1,            // The price of 1 ticket to join
    roundDays: 30,               // The round period (in days)
    commissionPct: 250,          // commissionPct = Commission Percentage * 100 (eg. 2.5% -> 2.5 * 100 = 250)
    
    LINKTokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",    // LINK token address
    VRFWrapperAddress: "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693",   // VRF wrapper address

    callbackGasPrice: 1000000,   // Gas price limit for randomness callback (only change it if you know what you do!)
}
