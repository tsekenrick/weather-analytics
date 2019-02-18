// require fs 
// require tempAnalytic.js
const fs = require('fs');
const ta = require('./tempAnalytic.js');

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
    console.log(ta.analyzeTemperature(res));
});