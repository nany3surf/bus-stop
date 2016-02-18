var proxy = require('../src/proxy.js');
var assert = require('assert');
var request = require('../src/request');
var sinon = require('sinon');


var sampleBusStopsList = {
  "markers": [
    {
      "id": "76014",
      "smsCode": "76014",
      "name": "Abinger Road",
      "stopIndicator": null,
      "towards": "Acton Green",
      "direction": "w",
      "lat": 51.49678794165259,
      "lng": -0.25004038368874176,
      "routes": [
        {
          "id": "94",
          "name": "94"
        },
        {
          "id": "272",
          "name": "272"
        }
      ]
    }
  ]
};

var sampleBusStopArrivals = {
  "lastUpdated": "17:23",
  "filterOut": [ ],
  "arrivals": [
    {
      "routeId": "K3",
      "routeName": "K3",
      "destination": "Roehampton Vale",
      "estimatedWait": "3 min",
      "scheduledTime": "16:27",
      "isRealTime": true,
      "isCancelled": false
    },
    {
      "routeId": "K3",
      "routeName": "K3",
      "destination": "Roehampton Vale",
      "estimatedWait": "20 min",
      "scheduledTime": "16:44",
      "isRealTime": true,
     "isCancelled": false
    }
  ],
  "serviceDisruptions": {
    "infoMessages": [],
    "importantMessages": [],
    "criticalMessages": []
  }
};

var sampleTflHtml = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"' +
  '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
  '<html xmlns="http://www.w3.org/1999/xhtml">' +
  '<head><title>Live bus arrivals | Transport for London</title></head>' +
  '<body></body>' +
  '</html>';


describe('TFL proxy', function () {

  describe('/bus-stops', function () {

    it('should translate bounding box lat lng format into tfl format', function (done) {
      var spy = sinon.spy(request, 'request');
      proxy.getMarkers('/bus-stops?northEast=51.50874245880333,-0.2197265625&southWest=51.481382896100975,-0.263671875', function () {});
      assert(spy.calledWithMatch('http://countdown.tfl.gov.uk/markers/swLat/51.481382896100975/swLng/-0.263671875/neLat/51.50874245880333/neLng/-0.2197265625/'));
      spy.restore();
      done();
    });

    it('should return a list of bus stops within a bounding box', function (done) {
      var path = '/bus-stops?northEast=51.50874245880333,-0.2197265625&southWest=51.481382896100975,-0.263671875';
      var stub = sinon.stub(request, 'request', function (path, callback) {
        callback(JSON.stringify(sampleBusStopsList));
      });
      proxy.getMarkers(path, function (data) {
        assert.deepEqual(data, sampleBusStopsList);
        done();
        stub.restore();
      });
    });

    // it('should send a 400 request if response from TFL isn\'t expected format', function (done) {
    //   var path = '/bus-stops?northEast=51.50874245880333,-0.2197265625&southWest=51.481382896100975';
    //   var stub = sinon.stub(request, 'request', function (path, callback) {
    //     callback(JSON.stringify(sampleTflHtml));
    //   });
    //   proxy.getMarkers(path, function (data) {
    //     assert.deepEqual(data, sampleTflHtml);
    //     done();
    //     stub.restore();
    //   });
    // });

  });

  describe('/bus-stops', function () {

    it('should translate our url to TFL url', function (done) {
      var spy = sinon.spy(request, 'request');
      proxy.getArrivals('/bus-stops/58382', function () {});
      assert(spy.calledWithMatch('http://countdown.tfl.gov.uk/stopBoard/58382'));
      spy.restore();
      done();
    });

    it('should return arrivals data', function (done) {
      var path = '/bus-stops/58382';
      var mock = sinon.stub(request, 'request', function (path, callback) {
        callback(JSON.stringify(sampleBusStopArrivals));
      });
      proxy.getArrivals(path, function (data) {
        assert.deepEqual(data, sampleBusStopArrivals);
        mock.restore();
        done();
      });
    });

  });
});
