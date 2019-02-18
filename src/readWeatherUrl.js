// require request
// require analytic.js
const a = require('./analytic.js');
const request = require('request');

const url = 'http://jvers.com/csci-ua.0480-spring2019-008/homework/02/';
const filename = 'temperature-resource';

request(`${url}${filename}.json`, function callback(error, reponse, body) {
  if(error) { console.log('error:', error); }
  
  const content = JSON.parse(body);
  console.log(a.generateReport(content['response'], content['variable'], content['unit']));

  // keep requesting until no more content['next']
  if(content['next']){
    request(`${url}${content['next']}.json`, callback);
  }

});