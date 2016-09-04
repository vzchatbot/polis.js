var querystring = require('querystring');
var https = require('https');

var host = 'www.thegamecrafter.com';
var username = 'JonBob';
var password = '*****';
var apiKey = '*****';
var sessionId = null;
var deckId = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';

function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}
function testfunction (req,res)
{
  
  return ({
        speech: "From another file e. I am Ent, an entertainment bot.  Would you like to see some recommendations for tonight?",
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Hi,there. I am Ent, an entertainment bot.  Would you like to see some recommendations for tonight?",
                        //"template_type":"generic",
                        //"elements":[
                        //	{
                        //		"title":"Hi,there. I am Ent, an entertainment bot.",
                        //		"image_url":"https://petersfancybrownhats.com/company_image.png",
                        //		"subtitle":"Would you like to see some recommendations for tonight?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes",
                                "payload": "Yes"
                            },
                            {
                                "type": "postback",
                                "title": "No",
                                "payload": "No"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}
