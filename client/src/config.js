exports.config = {

    ticketPrice: 0.1,            // The price of 1 ticket to join
    token: {
        name: 'Matic',
        platform: 'Polygon',
        shortName: 'MATIC', 
        unitName: 'MATIC',
    },
    roundDays: 30,               // The round period (in days), max 255 days
    commissionPct: 250,          // commissionPct = Commission Percentage * 100 (eg. 2.5% -> 2.5 * 100 = 250)
 }
