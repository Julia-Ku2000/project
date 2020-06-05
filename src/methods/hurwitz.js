const { createPriceProfitTable, getAudienceTheater } = require('./utils');

function Hurwitz(visitors, buyersPercent) {

    var audienceTheater = getAudienceTheater(visitors, buyersPercent),
        priceTableProfit = createPriceProfitTable(audienceTheater);

    var calculateCoefs = [];
    
    for (var i = 0; i < audienceTheater.length; i++) {
        calculateCoefs.push(0.5 * Math.max(...priceTableProfit[i]) + 0.5 * Math.min(...priceTableProfit[i]));
    }
    
    var optimalStrategie = Math.max(...calculateCoefs),
        optimalStrategieNumber = calculateCoefs.indexOf(optimalStrategie) + 1;
    
    return {
        audienceTheater,
        priceTableProfit,
        calculateCoefs,
        optimalStrategie,
        optimalStrategieNumber
    };
}

module.exports = Hurwitz;