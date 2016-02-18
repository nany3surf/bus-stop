var request = require('./request');
var url = require('url');
var querystring = require('querystring');


module.exports.getMarkers = function (path, callback) {
  var queryStringParams = url.parse(path, true).query;
  var isParameterMissing = (queryStringParams.hasOwnProperty('northEast') && queryStringParams.hasOwnProperty('southWest')) === false;
  var northEast = queryStringParams.northEast.split(',');
  var southWest = queryStringParams.southWest.split(',');
  var tflUrl = 'http://countdown.tfl.gov.uk/markers/swLat/'+southWest[0]+'/swLng/'+southWest[1]+'/neLat/'+northEast[0]+'/neLng/'+northEast[1]+'/';

  if (isParameterMissing) {
    callback({
      errorMessage: "Missing parameter. Please ensure you have both 'northEast' and 'southWest' parameters defined."
    });
    return;
  } 

  request.request(tflUrl, function (data) {
    try {
      var rawData = JSON.parse(data);
      callback(rawData);
    } catch (error) {
      callback({
        errorMessage: 'There was an error retrieving bus stop information. Please ensure you have all necessary parameters and that they follow the correct syntax.'
      });
    }
  });  
};

module.exports.getArrivals = function (path, callback) {
  var busStopNumber = path.replace(/^\/bus-stops\/([0-9])\/?/, '$1'); 
  var isBusStopNumberMissing = typeof busStopNumber === 'undefined';
  
  if (isBusStopNumberMissing) {
    callback({
      errorMessage: 'You are missing a bus stop number'
    });
    return;
  } 

  var tflUrl = 'http://countdown.tfl.gov.uk/stopBoard/' + busStopNumber;
  request.request(tflUrl, function (data) {
    try {
      var rawData = JSON.parse(data);
      callback(rawData);
    } catch (error) {
      callback({
        errorMessage: 'There was an error retrieving bus stop information. Please ensure you use a valid bus stop id'
      });
    }
  });  
};