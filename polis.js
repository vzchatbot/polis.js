var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var servercall = require('./servicecall.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var PORT = process.env.PORT || 9000;

const FB_PAGE_ACCESS_TOKEN = "EAAZArBv48H88BAFGDLy0vltTEuqYDupSvx6ADaEZCeLq6GsiSe4vKmubESXMF3pRyme7dvb7jgTZA4dzbn1DpZAfGLyBr9geSqGKsiqr84xZBOr8blJnZCs6RnAz7tELkYzb1CK3vqOIPMpX7IPMDDB9dcmILSfLFStsSl7HKZBNRAIsoRDlGDb";

var router = express.Router(); 

var headersInfo = { "Content-Type": "application/json" };
var Client = require('node-rest-client').Client;
var client = new Client();
var args = {
    "headers": headersInfo
};


router.post('/webhook', function (req, res) {

res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");  
  var strIndent = req.body.result.metadata.intentName;
 // var action = req.body.result.action;
  //var mysource = req.body.result.source;
  
  res.json( {speech: "IntentFinished" ,	displayText: {Intentname: strIndent},source: "Verizon.js" });
	
});
/*
function MainMenu()
{
return( {IntentName: ,	Status: "Finished",source: "Verizon.js" };
	);	

}*/

app.use('/api', router);
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
