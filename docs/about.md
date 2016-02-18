## About
From time to time in London you'll need to catch a bus. Some lucky bus stops have live departure boards, but not all do. To help, this app will show a live departure board for any bus stop in London.

## Bus stop API

The bus stop API consists of the following resources:

1. [/bus-stops](#get-bus-stops)
1. [/bus-stops/{bus-stop-id}](#get-bus-stopsbus-stop-id)  

All requests support [JSONP](http://json-p.org/) via the 'callback' parameter (eg. `?callback=foo`).

<a id="get-bus-stops"></a>
### GET /bus-stops
Return a list of bus stops within a given area (a bounding pox defined by two opposing points of a rectangle).

#### Required parameters

- `northEast={lat,long}` - the top-right geographical point of a bounding box, where lat and long are decimal values.
- `southWest={lat,long}` - the bottom-left geographical point of a bounding box, where lat and long are decimal values.

#### Example URL

[`/bus-stops?northEast=51.52783450,-0.04076115&southWest=51.51560467,-0.10225884'`](/bus-stops?northEast=51.52783450,-0.04076115&southWest=51.51560467,-0.10225884)

#### 200 Response (ie. a successful request)

    {
      "markers": [
        {
          "id": "77994",
          "name": "Aldersgate Street / Goswell Road",
          "stopIndicator": "BX",
          "lat": 51.52363797159915,
          "lng": -0.09749245212910045,
          ...
          "routes": [{
            "id": "55",
            "name": "55"
          }]
        }
        ...
      ]
    }


#### 400 Response (ie. an error)
    {
      "errorMessage": "Missing parameter. Please ensure you have both 'northEast' and 'southWest' parameters defined."
    }



<a id="get-bus-stopsbus-stop-id"></a>
### GET **/bus-stops/{bus-stop-id}**
Retrieve a list of bus arrivals for a single stop

#### Required parameters

There are none.

#### Example URL

[`/bus-stops/58382`](/bus-stops/58382)



#### 200 Response

    {
      "arrivals": [
        {
          "routeId": "K3",
          "destination": "Roehampton Vale",
          "estimatedWait": "3 min",
          "scheduledTime": "16:27",
          "isCancelled": false,
          ...
        },
        ...
      ]
      ...
    }

#### 400 Response (ie. an error)
    {
      "errorMessage": "There was an error retrieving bus stop information. Please ensure you use a valid bus stop id"
    }
