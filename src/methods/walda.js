
const { createPriceProfitTable, getAudienceTheater } = require('./utils');

function Walda(visitors, buyersPercent) {

    var audienceTheater = getAudienceTheater(visitors, buyersPercent),
        priceTableProfit = createPriceProfitTable(audienceTheater);

    var minPriceProfitInRows = Array(audienceTheater.length);

    for (var i = 0; i < audienceTheater.length; i++) {
        minPriceProfitInRows[i] = Math.min(...priceTableProfit[i]);
    }

    var optimalStrategie = Math.max(...minPriceProfitInRows),
        optimalStrategieNumber = minPriceProfitInRows.indexOf(optimalStrategie) + 1;

    return {
        audienceTheater,
        priceTableProfit,
        minPriceProfitInRows,
        optimalStrategie,
        optimalStrategieNumber
    };
}

module.exports = Walda;