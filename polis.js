var express = require('express');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var PORT = process.env.PORT || 9000;

var router = express.Router(); 

//router.post('/webhook', function (req, res) {
app.post('/webhook', function (req, res) {
var intent = req.body.result.metadata.intentName;
console.log(req.body);
var intent = 'Initiate';
    switch (intent) {
        case "Initiate":
            res.send( 
                   {
        speech: "Hi,there. I am Ent, an entertainment bot.  Would you like to see some recommendations for tonight?",
        displayText: "TV Recommendations",
        data: {     },
        source: "Zero Service - app_zero.js"    }
                
            );
            break;
        case "Billing":
            res.json(billInquiry());
            break;
        case "yes-initiate":
            res.json(recommendTV());
            break;
        case "Recommendation":
            res.json(recommendTV());
            break;
        default:
            case "Initiate":
            res.send( 
                   {
        speech: "Hi,there. I am Ent, an entertainment bot.  Would you like to see some recommendations for tonight?",
        displayText: "TV Recommendations",
        data: {     },
        source: "Zero Service - app_zero.js"    }
                
            );
    }
 
})

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
