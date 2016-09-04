var express = require('express');
var fulcrumMiddleware = require('connect-fulcrum-webhook');

var PORT = process.env.PORT || 9000;

var app = express();

function payloadProcessor (payload, done) {
  // Do stuff with payload like update records in a database,
  // send text messages to field staff, email supervisors when
  // task marked complete, etc.

  // After you've processed the payload call done() with no arguments to signal
  // that the webhook has been processed. Call done(), passing an error to return
  // a 500 response to the webhook request, signaling that the request should be
  // tried again later.
  console.log('Payload:');
  console.log(payload);
  done()
}

var fulcrumMiddlewareConfig = {
  actions: ['record.create', 'record.update'],
  processor: payloadProcessor
};

app.use('/', fulcrumMiddleware(fulcrumMiddlewareConfig));

app.get('/', function (req, res) {
  //res.send('<html><head><title>Polis.js</title></head><body><h2>polis.js</h2><p>Up and Running!</p></body></html>');
 // res.send('test message');
  res.send({
 "speech": "Today in Boston: Fair, the temperature is 37 F",
  "source": "apiai-weather-webhook-sample",
  "displayText": "Today in Boston: Fair, the temperature is 37 F"});
 
 
})

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
