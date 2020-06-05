
const { createPriceProfitTable, getAudienceTheater } = require('./utils');

function Regret(visitors, buyersPercent) {

    var audienceTheater = getAudienceTheater(visitors, buyersPercent);
    var priceTableProfit = createPriceProfitTable(audienceTheater);

    var minPriceProfitInRows = Array(audienceTheater.length),
        riskMatrix = Array(audienceTheater.length);
    
    for (var i = 0; i < audienceTheater.length; i++) {
        riskMatrix[i] = [];

        for (var j = 0; j < audienceTheater.length; j++) {
            if (priceTableProfit[j][i] > priceTableProfit[i][i] ) {
                riskMatrix[i].push(priceTableProfit[j][i] - priceTableProfit[i][i]);
            } else {
                riskMatrix[i].push(priceTableProfit[i][i] - priceTableProfit[j][i]);
            }
        }
    }

    var maxPriceProfitInRows = Array(audienceTheater.length);
    for (var i = 0; i < audienceTheater.length; i++) {
        maxPriceProfitInRows[i] = Math.max(...riskMatrix[i]);
    }

    var optimalStrategie = Math.min(...maxPriceProfitInRows),
        optimalStrategieNumber = maxPriceProfitInRows.indexOf(optimalStrategie) + 1;

    return {
        audienceTheater,
        maxPriceProfitInRows,
        optimalStrategie,
        optimalStrategieNumber,
        riskMatrix,
        priceTableProfit,
    };
}

module.exports = Regret;