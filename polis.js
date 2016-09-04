var express = require('express');


var PORT = process.env.PORT || 9000;

var app = express();

app.post('/webhook', function (req, res) {
  //res.send('<html><head><title>Polis.js</title></head><body><h2>polis.js</h2><p>Up and Running!</p></body></html>');
 // res.send('test message');
  return({
 "speech": "Today in Boston: Fair, the temperature is 37 F",
  "source": "apiai-weather-webhook-sample",
  "displayText": "Today in Boston: Fair, the temperature is 37 F"});
 
 
})

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
