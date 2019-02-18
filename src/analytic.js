// function generateReport
function generateReport(weatherData, variable, unit){
    let retStr = '';

    // K to F
    if(variable === 'temperature' && unit === 'K'){
        unit = 'F';
        weatherData = weatherData.map(function(obj){
            const ret = {};
            Object.entries(obj).map(function(pair) {
                if(pair[0] === 'datetime') {
                    ret[pair[0]] = pair[1];
                } else {
                    ret[pair[0]] = pair[1] * 1.8 - 459.67;
                }
            });
            return ret;
        });
    }
    // Top 10 warmest and coldest mean temperatures
    const tempSums = weatherData.reduce(function(acc, cur){
        // iterate over location names
        Object.keys(cur).map(function(key){
            if(key in acc && key !== 'datetime'){
                acc[key] += cur[key];
            } else if (key !== 'datetime') {
                acc[key] = cur[key];
            }
        });

        return acc;
    }, {});

    const meanTemps = Object.keys(tempSums).map(key => {
        tempSums[key] /= weatherData.length;
        return tempSums[key];
    });

    // get warmest 10
    meanTemps.sort((a, b) => b - a); // desc sort
    retStr += `\nTop 10 Cities with highest mean ${variable}\n`;
    let count = 0;
    meanTemps.map(temp => {
        // find location in tempSums matching temp
        if(count < 10){
            const location = Object.keys(tempSums).find(key => tempSums[key] === temp);
            retStr += `${location}: ${temp.toFixed(2)} (${unit})\n`;
        }
        count += 1;
    });
    
    // get coolest 10
    meanTemps.sort((a, b) => a - b); // asc sort
    retStr += `\nTop 10 Cities with lowest mean ${variable}\n`;
    count = 0;
    meanTemps.map(temp => {
        // find location in tempSums matching temp
        if(count < 10){
            const location = Object.keys(tempSums).find(key => tempSums[key] === temp);
            retStr += `${location}: ${temp.toFixed(2)} (${unit})\n`;
        }
        count += 1;
    });

    // Average New York temp in Spr 13
    const sprTempSum = weatherData.reduce((acc, cur) => {
        const date = new Date(cur['datetime']);
        if(date.getFullYear() === 2013 && date.getMonth() > 0 && date.getMonth() < 4){
            acc[0] += cur['New York'];
            acc[1] += 1;
        }
        return acc;
    }, [0, 0]);

    retStr += `\nThe average ${variable} over spring 2013 in New York is: ${(sprTempSum[0]/sprTempSum[1]).toFixed(2)} (${unit}) \n`;

    return retStr;
}

module.exports = {
    generateReport
};