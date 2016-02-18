var http = require('http');

exports.request = function (path, callback) {
  http.get(path, function (response) {
    var pageData = "";
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      pageData += chunk;
    });
    response.on('end', function() {
      callback(pageData);
    });
  });
};