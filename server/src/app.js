var http = require('http');
var proxy = require('./proxy');
var url = require('url');
var express = require('express');
var app = express();
var developmentPort = 5000;
var path = require('path');


exports.startServer = function () {
  initialiseStaticServer();
  initialiseRoutes();
  startServer();
};


function initialiseStaticServer() {
  app.use(express.static(__dirname + '/../../client/'));
}


function initialiseRoutes() {
  app.get('/bus-stops/*', function(request, response) {
    proxy.getArrivals(request.url, function(jsonData, path) {
      var queryStringParameters = url.parse(request.url, true).query;
      var jsonpCallbackName = queryStringParameters.callback;
      var isJsonP = typeof jsonpCallbackName !== 'undefined';
      if (isJsonP) {
        response.send(jsonpCallbackName + '(' +JSON.stringify(jsonData) + ')' );
      } else {
        response.json(jsonData);
      }
    });
  });

  app.get('/bus-stops*', function(request, response) {
    proxy.getMarkers(request.url, function(jsonData, path) {
      var isError = jsonData.hasOwnProperty('errorMessage');
      if (isError) {
        response.send(400, jsonData);
      } else {
        var queryStringParameters = url.parse(request.url, true).query;
        var jsonpCallbackName = queryStringParameters.callback;
        var isJsonP = typeof jsonpCallbackName !== 'undefined';
        if (isJsonP) {
          response.send(jsonpCallbackName + '(' +JSON.stringify(jsonData) + ')' );
        } else {
          response.json(jsonData);
        }
      }
    });
  });

  app.get('/', function (request, response) {
    var pathToIndex = path.resolve(__dirname + '/../../client/index.html');
    response.sendfile(pathToIndex);
  });

  app.use(function (request, response) {
    response.send(404, {
      errorMessage: 'The requested resource or page was not found'
    });
  });

}


function startServer() {
  var port = process.env.PORT || developmentPort;
  app.listen(port, function() {
    console.log("Listening on " + port);
  });
}
