exports.config = {

    ticketPrice: 0.1,            // The price of 1 ticket to join
    token: {
        name: 'MATIC',           // 'Ether'   
        platform: 'Polygon',     // 'Ethereum'
        shortName: 'MATIC',      // 'Ether'
        unitName: 'MATIC',       // 'ETH'
        explorerUrl: 'https://mumbai.polygonscan.com/tx/'
    },
    roundDays: 30,               // The round period (in days), max 255 days
    commissionPct: 250,          // commissionPct = Commission Percentage * 100 (eg. 2.5% -> 2.5 * 100 = 250)
 }
