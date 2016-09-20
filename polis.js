var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var servercall = require('./servicecall.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var PORT = process.env.PORT || 9000;

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

  var action = req.body.result.action;
  var mysource = req.body.result.source;

    switch (action) {
        case "welcome":
             res.json(chatInitiate());
            break;
        case "getStarted":
            res.json(welcomeMsg());
            break;
    	case "LinkOptions":
             res.json(LinkOptions());
            break;
        case "MoreOptions":
             res.json(MoreOptions());
            break;
        case "Billing":
            res.json(billInquiry());
           //res.json(myfunction());
            break;
        case "showrecommendation":
            res.json(recommendTV());
            break;
        case "Recommendation":
            res.json(recommendTV());
            break;
        case "record":
            res.json(record(req));
            break;
        case "upsell":
            res.json(upsell(req));
            break;
        case "upgradeDVR":
            res.json(upgradeDVR(req));
            break;
        case "externalcall":
            recommendTVNew(function (str) { 
                console.log("inside showrecommendation "); 
                res.json(recommendTVNew1(str)); 
            }); 
            break;
        default:
            res.json(recommendTV());
    }
});

function myfunction() 
 {
	console.log("inside fn call");
	var reqData = { "Flow": "TroubleShooting Flows\\Test\\APIChatBot.xml", "Request": { "ThisValue": "1" } };
	var Client = require('node-rest-client').Client;
	var client = new Client();
	var args = {
		"headers": headersInfo,
		"data": JSON.stringify(reqData)
	};
	console.log("before call");
	var req = client.post("https://vznode1.herokuapp.com/api/webhook/", args, function (data, response) {
		try {	
			console.log("inside success");
			var parsedData = "";
			if (null != data) {
				console.log("data" + data);
				parsedData = JSON.parse(data);
				console.log("parsedData" +parsedData);
				var inputsJSON = parsedData[0];
				console.log("inputsJSON" +inputsJSON);
				headersInfo = response.headers;

			
			}
			else {
				var err = {
					"description" : "Response data is empty!",
					"data" : data
				};
			
			}
		}
        catch (ex) {
			var err = {
				"description" : "Exception occurred:" + ex,
				"data" : data
			};
		
		}
	});
	req.on("error", function (errInfo) {
		var err = {
			"description" : "Exception occurred:" + errInfo.message,
			"data" : ""
		};
		if (null != fnCallback && typeof fnCallback == "function") {
			console.log(err, null);
		}
	});
};


function recommendTVNew(callback) { 
       	console.log('inside external call ');

     
     //http://vzbotapi.azurewebsites.net/api/values  https://vznode1.herokuapp.com/api/webhook/
     //https://www98.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx
     //{"Flow": "TroubleShooting Flows\\Test\\APIChatBot.xml","Request":{"ThisValue":"Trending"}}
     //https://www98.verizon.com/Ondemand/VzWhatsHot.ashx
     //https://myvzbot.herokuapp.com/api/vzwhatshot
     // "{\"Flow\": \"TroubleShooting Flows\\Test\\APIChatBot.xml\",\"Request\":{\"ThisValue\":\"Trending\"}}",
   request( 
         'https://www98.verizon.com/Ondemand/VzWhatsHot.ashx', 
          function (error, response, body) { console.log('inside external call');
             if (!error && response.statusCode == 200) { 
             	console.log('inside external call success');
             	console.log(body);
                 callback(body); 
             } 
             else 	console.log('error: ' + error + ' body: ' + body);
         } 
     ); 
     
       } 
function recommendTVNew1(apiresp) { 
 	   var jsonresp = JSON.parse(apiresp);
     return ({ 
	         speech: "Here are some recommendations for tonight", 
         displayText: "TV recommendations", 
         data:  jsonresp, 
         source: "Zero Service - app_zero.js" 
     }); 
 } 



/* 
  function recommendTVNew(callback) {
//https://www98.verizon.com/Ondemand/api/utilWebAPI/GetWhatsHot
//    var req = client.post(" http://www98.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", "{\"Flow\": \"TroubleShooting Flows\\Test\\APIChatBot.xml\",\"Request\":{\"ThisValue\":\"1\"}}", function (data, response) {
   console.log("suresh method recommendTVNew");
   var req = client.post("https://myvzbot.herokuapp.com/api/vzwhatshot", args, function (data, response) {
	    console.log("data"+ data);
	var parsedData = "";        
        parsedData = JSON.parse(data);
	var inputsJSON = parsedData[0];
				
        
        
      
         console.log("inputsJSON"+ inputsJSON);
        callback(inputsJSON);

    });
}

function recommendTVNew1(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
   console.log("objToJson"+ objToJson);
   
    //var output = eval('(' + JSON.stringify(apiresp) + ')');
    console.log("apiresp1:" + JSON.stringify(objToJson));
    //console.log("output1:" + output);
    //var parsedResponse = JSON.parse(apiresp);


    //console.log(aa);
    //return objToJson;

    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: objToJson,
        source: "Zero Service - app_zero.js"
    });

}

*/
function welcomeInit()
{
  
  /*
  
  curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "message":{
        "text":"Hey! Looking for something to watch? Let Verizon tell you what's on tonight! Click Get Started to find personazlied recommendations for you. When you tap Get Started, Verizon will see your public information "
       }
     }
   ]
 }' "https://graph.facebook.com/v2.6/apiaivzentpage/thread_settings?access_token=EAAZArBv48H88BAFGDLy0vltTEuqYDupSvx6ADaEZCeLq6GsiSe4vKmubESXMF3pRyme7dvb7jgTZA4dzbn1DpZAfGLyBr9geSqGKsiqr84xZBOr8blJnZCs6RnAz7tELkYzb1CK3vqOIPMpX7IPMDDB9dcmILSfLFStsSl7HKZBNRAIsoRDlGDb"
  
  */
    
    return (
      { speech: " Hey Tabi, Welcome to Verizon!",
          displayText: " Hey Tabi, Welcome to Verizon!",
        data: {
		"facebook": [
			{"text": "Here is a video to watch:"},
			{"sender_action": "typing_on"},
			{
			"attachment": {
			"type": "video",
			"payload": {"url": "http://path.to/video.mp4"}
				      }
			}
		]
	   }
      
        }
     );	
}

function upgradeDVR(apireq)
{
   var confirm =  apireq.body.result.parameters.Confirm.toUpperCase();
   if (confirm =="YES")
    	var respstr ="Congrats, Your DVR is upgraded.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?" ;
   else
    	var respstr ="Ok, we are not upgratding the DVR now.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?" ;

    return ({
        speech: respstr ,
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": respstr,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "TV Recommendations",
                                "payload": "Yes"
                            },
                            {
                                "type": "postback",
                                "title": "Record",
                                "payload": "I want to record"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
    
  }


function LinkOptions()
{
     console.log('Calling from  link options:') ;
    return (
        {
        speech: "Are you looking for something to watch, or do you want to see more options? Type or tap below.",
        displayText: "Link Account",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Are you looking for something to watch, or do you want to see more options? Type or tap below.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "On Now",
                                "payload": "On Now"
                            },
                            {
                                "type": "postback",
                                "title": "On Later",
                                "payload": "On Later"
                            },
                            {
                                "type": "postback",
                                "title": "More Options",
                                "payload": "More Options"
                            }
                        ]
                    }
                }
            }
        },
        source: "Verizon.js"
      }
      );	
	
}

function welcomeMsg()
{
    
    return (
        {
        speech: "Hey Tabi, welcome to Verizon! Want to know what’s on tonight?  I can answer almost anything, so try me! Also, if you want personalized alerts through Messenger link me to your Verizon account! ",
        displayText: "Link Account",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Hey Tabi, welcome to Verizon! Want to know what’s on tonight?  I can answer almost anything, so try me! Also, if you want personalized alerts through Messenger link me to your Verizon account! ",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Link Account",
                                "payload": "Link Account"
                            }
                        ]
                    }
                }
            }
        },
        source: "Verizon.js"
      }
      );	
	
}
    
function MoreOptions()
{
    
    return (
        {
        speech: "You can also ask 'What Channel is ESPN', ' what channel is Game of Thornes is on', 'any romantic comedies on tonight' or type 'support' to get account help from a Verizon representative. ",
        displayText: "Link Account",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "You can also ask 'What Channel is ESPN', ' what channel is Game of Thornes is on', 'any romantic comedies on tonight' or type 'support' to get account help from a Verizon representative. ",
                   }
                }
            }
        },
        source: "Verizon.js"
      }
      );	
	
}
  






function record(apireq)
{
	
var channel = apireq.body.result.parameters.Channel;

if (channel == 'HBO')
{
return ({
        speech: " Sorry you are not subscribed to " + channel +". Would you like to subscribe " + channel + "?",
        displayText: "Subscribe",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": " Sorry you are not subscribed to " + channel +". Would you like to subscribe " + channel + "?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Subscribe",
                                "payload": "Subscribe"
                            },
                            {
                                "type": "postback",
                                "title": "No, I'll do it later ",
                                "payload": "No Subscribe"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });	
	
}
else if (channel == 'CBS')
{
return ({
        speech: " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
        displayText: "Subscribe",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": " Sorry you are not subscribed to " + channel +". Would you like to subscribe " + channel + "?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Upgrade my DVR",
                                "payload": "Upgrade my DVR"
                            },
                            {
                                "type": "postback",
                                "title": "No, I'll do it later ",
                                "payload": "No Upgrade"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });	
	
}
else	
{	
var respstr ='Your recording for ' + apireq.body.result.parameters.Programs +' scheduled at '+ apireq.body.result.parameters.TimeofPgm ;
 return ({
        speech: respstr + "  Would you like to see some other TV Recommendations for tonight?",
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": respstr + "  Would you like to see some other TV Recommendations for tonight?",
                        //"template_type":"generic",
                        //"elements":[
                        //	{
                        //		"title":"Hi,there. I am Ent, an entertainment bot.",
                        //		"image_url":"https://petersfancybrownhats.com/company_image.png",
                        //		"subtitle":"Would you like to see some recommendations for tonight?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Show Recommendations",
                                "payload": "Show Recommendations"
                            },
                            {
                                "type": "postback",
                                "title": "No, Let me tell",
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
}


function upsell(apireq) {
	
var respstr ='Congrats, Now you are subscribed for ' + apireq.body.result.parameters.Channel +" Channel.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?" ;

    return ({
        speech: respstr ,
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": respstr,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "TV Recommendations",
                                "payload": "Yes"
                            },
                            {
                                "type": "postback",
                                "title": "Record",
                                "payload": "I want to record"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}

function performcall1(req,res){
	
	res.end('welcome');
}


function performcall(req,res){
console.log("starting performcall");

console.log(performcall1());

	var myresp='';
	return request.post({
	  headers: {'content-type' : 'application/x-www-form-urlencoded'},
	  url:     'https://vznode1.herokuapp.com/api/webhook/',
	  body:    "mes=heydude"
	}, function(error, response, body)
		{
			console.log("inside fn call");
			if (!error && response.statusCode == 200) 
    			{
    			//console.log(body); // Print the google web page.
    			//callback(body);
			myresp = body;
			
			console.log(myresp);
    			}
    			 else
			     {
			     	console.log(error);
			     	console.log(response.statusCode);
			     	myresp=recommendTV();
			     	
			     }
		}
	);

};

function callapi(callback){
//http://vzbotapi.azurewebsites.net/api/values
	request.post( 
        'https://vznode1.herokuapp.com/api/webhook/', 
         function (error, response, body) { 
            if (!error && response.statusCode == 200) { 
                callback(body); 
            } 
        } 
    );
	
	
};

function performRequest(endpoint, method, data, success) {
  console.log('staring performRequest ');
  var querystring = require('querystring');
var https = require('https');

var host = '';
var username = '';
var password = '';
var apiKey = '';
var sessionId = null;
var deckId = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';
var responseObject='';
 var responseString = '';
 
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

   

    res.on('data', function(data) {
      responseString += data;
   
    });

    res.on('end', function() {
      console.log('responseString:'+responseString);
       responseObject = JSON.parse(responseString);
       //console.log('responseObject:'+ responseObject);
       //console.log('dataString:'+ dataString);
       
      success(responseObject);
    });
  });
//console.log('endpoint:'+ endpoint);
  req.write(dataString);
  req.end();

  return{
    
     speech:'response from call' ,
        displayText: "TV recommendations",
        data: responseObject,
         source: "test functions"
  }
 };


function recommendTV() {
    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Shark Tank",
                                "subtitle": "Shark Tank",
                                "image_url": "http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=414,h=303,crop=auto/?sig=88c390c980d4fa53d37ef16fbdc53ec3dfbad7d9fa626949827b76ae37140ac3&amp;app=powerplay",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "http://www.youtube.com/embed/SQ1W7RsXL3k",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "Game of Thrones",
                                "subtitle": "Game of Thrones",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjM5OTQ1MTY5Nl5BMl5BanBnXkFtZTgwMjM3NzMxODE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "The Night Of",
                                "subtitle": "The Night Of",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjQyOTgxMDI0Nl5BMl5BanBnXkFtZTgwOTE4MzczOTE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}

function pgmDetails() {
    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Shark Tank",
                                "subtitle": "Shark Tank",
                                "image_url": "http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=414,h=303,crop=auto/?sig=88c390c980d4fa53d37ef16fbdc53ec3dfbad7d9fa626949827b76ae37140ac3&amp;app=powerplay",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "http://www.youtube.com/embed/SQ1W7RsXL3k",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "Game of Thrones",
                                "subtitle": "Game of Thrones",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjM5OTQ1MTY5Nl5BMl5BanBnXkFtZTgwMjM3NzMxODE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "The Night Of",
                                "subtitle": "The Night Of",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjQyOTgxMDI0Nl5BMl5BanBnXkFtZTgwOTE4MzczOTE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}
function chatInitiate() {
    return ({
        speech: "Hi, I am Verizon Entertainment bot.  I can help you with  TV Recommendations or Recording a program. What would you like to do?",
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Hi, I am Verizon Entertainment bot.  I can help you with  TV Recommendations or Recording a program. What would you like to do?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "TV Recommendations",
                                "payload": "Yes"
                            },
                            {
                                "type": "postback",
                                "title": "Record",
                                "payload": "I want to record"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}
function billInquiry() {
    return ({
        speech: "Let me get an expert to help you.  Please click on the link below.",
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Unfortunately, I'm unable to help with that query.  Would you like to talk to an expert?",
                        "buttons": [
                            {
                                "type": "phone_number",
                                "title": "Talk to an agent",
                                "payload": "+919962560884"
                            },
                            {
                                "type": "postback",
                                "title": "No, thanks",
                                "payload": "No, thanks"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}
// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', router);
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
