// function analyzeTemperature
const fs = require('fs');

function analyzeTemperature(weatherData){
    let retStr = '';

    // First 10 lines of NY
    retStr += "The first 10 lines of Temperature in NY:\n";
    let count = 0;
    weatherData.map(function(obj){
        count += 1;
        const time = obj.datetime;
        const filtered = Object.entries(obj).filter((pair) => pair[0] === 'New York');
        if(count < 10){
            filtered.map(pair => retStr += `At ${time}, the temperature in NY is ${pair[1].toPrecision(4)} (F)\n`);
        }    
    });
    
    // Mean temp in San Diego
    const mean = weatherData.reduce(function(acc, cur){
        return acc + cur['San Diego'];
    }, 0);
    retStr += `\nThe mean temperature in San Diego is: ${(mean/weatherData.length).toPrecision(4)}\n\n`;

    // Min/max of temp in New York
    const min = weatherData.reduce(function(acc, cur){
        return acc[0] >= cur['New York'] ? [cur['New York'], cur['datetime']] : acc;
    }, [Infinity, undefined]);
    retStr += `The coldest time in New York is ${min[1]}\n`;
    retStr += `The lowest temperature is: ${min[0].toPrecision(4)} (F)\n`;
    
    const max = weatherData.reduce(function(acc, cur){
        return acc[0] <= cur['New York'] ? [cur['New York'], cur['datetime']] : acc;
    }, [-Infinity, undefined]);
    retStr += `The warmest time in New York is ${max[1]}\n`;
    retStr += `The highest temperature is: ${max[0].toPrecision(4)} (F)\n`;
    
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
    retStr += "\nTop 10 Cities with highest mean temperature\n";
    count = 0;
    meanTemps.map(temp => {
        count += 1;
        // find location in tempSums matching temp
        if(count < 10){
            const location = Object.keys(tempSums).find(key => tempSums[key] === temp);
            retStr += `${location}: ${temp.toPrecision(4)} (F)\n`;
        }
        
    });
    
    // get coolest 10
    meanTemps.sort((a, b) => a - b); // asc sort
    retStr += "\nTop 10 Cities with lowest mean temperature\n";
    count = 0;
    meanTemps.map(temp => {
        count += 1;
        // find location in tempSums matching temp
        if(count < 10){
            const location = Object.keys(tempSums).find(key => tempSums[key] === temp);
            retStr += `${location}: ${temp.toPrecision(4)} (F)\n`;
        }
        
    });

    // Average New York temp in Spr 13
    
    return retStr;
}

let content;
fs.readFile('./historical-hourly-weather-data-json/temperature.json', 'utf8', (err, data) => {
    if(err){
        console.log('error');
    }

    // parse data into res array and convert K to F
    content = JSON.parse(data);
    const res = content.map(function(obj){
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
    const strReport = analyzeTemperature(res);
    console.log(strReport);
    // demo of traversing data in res
    // let count = 0;
    // res.map(function(obj){
    //     count += 1;
    //     const time = obj.datetime;
    //     const filtered = Object.entries(obj).filter((pair) => pair[0] === 'New York');
    //     if(count < 10){
    //         filtered.map(pair => console.log(`At ${time}, temp in NY is ${pair[1].toPrecision(4)} (F)`));
    //     }
        
    // });
});

module.exports = {
    analyzeTemperature
};



