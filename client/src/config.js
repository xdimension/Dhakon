exports.config = {
    appName: 'CrowdPot',
    contract: {
        address: '0xbE5091ca8eE651808758A8804eEA71F9A6B1F170',
        jsonFile: 'Dhakon.json',
    },

    network: {
        name: 'Polygon Amoy',
        id: 80002
    },

    token: {
        name: 'MATIC',           // 'Ether'
        platform: 'Polygon',     // 'Ethereum'
        shortName: 'MATIC',      // 'Ether'
        unitName: 'MATIC',       // 'ETH'
        explorerUrl: 'https://amoy.polygonscan.com/tx/'
    },

    ticketPrice: 0.1,            // The price of 1 ticket to join
    roundDays: 30,               // The round period (in days), max 255 days
    commissionPct: 250,          // commissionPct = Commission Percentage * 100 (eg. 2.5% -> 2.5 * 100 = 250)
 }
