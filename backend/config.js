require('dotenv').config();

exports.config = {

    ticketPrice: 0.1,            // The price of 1 ticket to join
    roundDays: 30,               // The round period (in days), max 255 days
    commissionPct: 250,          // commissionPct = Commission Percentage * 100 (eg. 2.5% -> 2.5 * 100 = 250)

    LINKTokenAddress: process.env['LINK_TOKEN_ADDR'],       // LINK token address
    VRFWrapperAddress: process.env['VRF_WRAPPER_ADDR'],     // VRF wrapper address

    callbackGasPrice: 1000000,   // Gas price limit for randomness callback (only change it if you know what you do!)
}
