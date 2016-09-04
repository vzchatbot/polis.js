var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
// configure app to use bodyParser()
// this will let us get the data from a POST
console.log('my message server started...');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 5000; // set our port
var router = express.Router(); 

router.post('/webhook', function (req, res) {
var intent = req.body.result.metadata.intentName;
//var intent = 'Initiate';
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
