
const constants = require('./constants');

function calculateProfit(sellsProgramsCount, orderedProgramsCount) {
    return constants.SELLING_PRICE * sellsProgramsCount + constants.MARKETING_PROFIT - constants.ORDER_PRICE - constants.PROGRAMM_PRICE * orderedProgramsCount;
};

function getAudienceTheater(visitors, buyersPercent) {
    return visitors.map((value) => value * buyersPercent * 0.01);
}

function createPriceProfitTable(audienceTheater) {
    var priceTableProfit = Array(audienceTheater.length);
    
    for (var i = 0; i < audienceTheater.length; i++) {
        priceTableProfit[i] = [];

        for (var j = 0; j < audienceTheater.length; j++) {
            priceTableProfit[i].push(calculateProfit(audienceTheater[j], audienceTheater[i]));
        }
    }

    return priceTableProfit;
}

module.exports = {
    createPriceProfitTable,
    getAudienceTheater
};
