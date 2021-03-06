"use strict";

var utils = require('../utils/utils'),
    ruleRegexp = /^([0-9]+)([MV]?)([0-9]*)$/i;

var getNeighbourMethod = function (methodId) {
    if (methodId === 'V' || methodId === 'v' || methodId === 'von-neumann') {
        return 'von-neumann';
    } else {
        return 'moore';
    }
};

var parseRuleString = function (ruleString) {
    var extractedRule = ruleRegexp.exec(utils.stripWhitespaces(ruleString));

    return extractedRule ? {
        ruleFormat: 'vote',
        ruleString: ruleString,
        vote: utils.splitStringInNumberArray(extractedRule[1]),
        neighbourhoodType: getNeighbourMethod(extractedRule[2]),
        neighbourhoodRange: parseInt(extractedRule[3], 10) || 1
    } : null;
};

var voteFunction = function (currentValue, neighbours) {
    var index = 0,
        sum = currentValue,
        neighboursLength = neighbours.length,
        result;

    for (; index < neighboursLength; index++) {
        sum = sum + neighbours[index];
    }

    if (this.vote.indexOf(sum) > -1) {
        result = 1;
    } else {
        result = 0;
    }

    return result;
};

var vote = function (rule) {
    var ruleDescription = parseRuleString(rule);

    if (ruleDescription !== null) {
        ruleDescription.process = voteFunction;
    }

    return ruleDescription;
};

module.exports = vote;
