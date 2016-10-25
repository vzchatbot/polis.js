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

console.log("From my mytemphook call");
console.log(req.body);
	
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");  

  var action = req.body.result.action;
  var mysource = req.body.result.source;
  
  console.log("Action " + action);
	console.log("Source " + mysource);
	
    switch (action) {
	case "SignIn":
		res.json(acclinking(req));
		break;
        case "welcome":
            // res.json(chatInitiate());
             res.json(secondMsg(req));
       //  res.json(welcomeInit());
            break;
        case "CategoryList":
           res.json(CategoryList(req));
	    break;
        case "getStarted":
           res.json(welcomeMsg());
        break;
    	case "LinkOptions":
             res.json(LinkOptionsNew(req));
            break;
        case "MoreOptions":
             res.json(MoreOptions());
            break;
        case "Billing":
           STBList(req,function (str) {res.json(STBListCallBack(str));  }); 
            break;
        case "record":
           res.json(record(req));
            break;
	 case "stblist":
           getstblist(req,function (subflow){res.json(subflow);});
            break;
        case "upsell":
            res.json(upsell(req));
            break;
        case "upgradeDVR":
            res.json(upgradeDVR(req));
            break;
         case "MainMenu":
            res.json(MainMenu());
            break;
	case "Trending":
            recommendTVNew('Trending',function (str) {res.json(recommendTVNew1(str));  }); 
            break;
        case "recommendation":
            //recommendTVNew('whatshot',function (str) {res.json(recommendTVNew1(str));  }); 
	        res.json(demowhatshot());
		break;
	case "channelsearch":
            ChnlSearch(req,function (str) {res.json(ChnlSearchCallback(str));  }); 
            break; 
	case "programSearchdummy":
	    res.json(programSearch(req));
            break;
	case "programSearch":
              PgmSearch(req,function (str) {res.json(PgmSearchCallback(str));  }); 
            break; 
	case "recordnew":
              	var channel = req.body.result.parameters.Channel.toUpperCase();
		var program = req.body.result.parameters.Programs.toUpperCase();
		var time = req.body.result.parameters.timeofpgm;
		var dateofrecord = req.body.result.parameters.date;
		var SelectedSTB = req.body.result.parameters.SelectedSTB;
		console.log("SelectedSTB : " + SelectedSTB + " channel : " + channel + " dateofrecord :" + dateofrecord + " time :" + time);
		if (time == "") {PgmSearch(req, function (str) { res.json(PgmSearchCallback(str)); });}
		else if (SelectedSTB == "" || SelectedSTB == undefined) {getstblist(req, function (subflow) { res.json(subflow); });}
		else if (channel == 'HBO') //not subscribed case
		{
		res.json ({
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
						"payload": "Main Menu"
					    }
					]
				    }
				}
			    }
			},
			source: "Zero Service - app_zero.js"
		    });	

		}
		else if (channel == 'CBS')  //DVR full case
		{
		res.json ({
			speech: " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
			displayText: "Subscribe",
			data: {
			    "facebook": {
				"attachment": {
				    "type": "template",
				    "payload": {
                        "template_type": "button",
                        "text": " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Upgrade my DVR",
                                "payload": "Upgrade my DVR"
                            },
                            {
                                "type": "postback",
                                "title": "No, I'll do it later ",
                                "payload": "Main Menu"
                          	  }
                      		  ]
				 }
				}
			    }
			},
			source: "Zero Service - app_zero.js"
		    });	

		}
		else {
				
			console.log(" Channel: " + req.body.result.parameters.Channel +" Programs: " + req.body.result.parameters.Programs +" SelectedSTB: " + req.body.result.parameters.SelectedSTB +" Duration: " + req.body.result.parameters.Duration +" FiosId: " + req.body.result.parameters.FiosId +" RegionId: " + req.body.result.parameters.RegionId +" STBModel: " + req.body.result.parameters.STBModel +" StationId: " + req.body.result.parameters.StationId +" date: " + req.body.result.parameters.date +" timeofpgm: " + req.body.result.parameters.timeofpgm );
			DVRRecord(req, function (str) { res.json(DVRRecordCallback(str)); });
			/*
			var respstr = 'Your recording for "' + req.body.result.parameters.Programs +  '"  on ' + req.body.result.parameters.Channel  +' channel, has been scheduled at ' + req.body.result.parameters.timeofpgm + ' on ' + req.body.result.parameters.SelectedSTB + ' STB.';
				res.json({
				speech: respstr + " Would you like to see some other TV Recommendations for tonight?",
				displayText: "TV Recommendations",
				data: {
					"facebook": {
					"attachment": {
					"type": "template",
					"payload": {
					"template_type": "button",
					"text": respstr + " Would you like to see some other TV Recommendations for tonight?",
					"buttons": [
					{
					"type": "postback",
					"title": "Show Recommendations",
					"payload": "Show Recommendations"
					},
					{
					"type": "postback",
					"title": "More Options",
					"payload": "More Options"
					}]}}}
				},
				source: "Verizon.js"
				});*/
		}  
  
            break; 
        default:
            res.json(recommendTV());
    }
});



function MainMenu()
{
return( {
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
							"title": "What's on tonight?",
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

function demowhatshot() {
    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        //data: {"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Shark Tank","subtitle":"CNBC : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Shark Tank Channel: CNBC"}]},{"title":"Family Guy","subtitle":"WBIN : Interests,News","image_url":"http://image.vam.synacor.com.edgesuite.net/8d/53/8d532ad0e94c271f8fb153a86141de2c92ee15b0/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Family Guy Channel: WBIN"}]},{"title":"NCIS","subtitle":"USA : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/85/ed/85ed791472df3065ae5462d42560773a649fdfaf/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: NCIS Channel: USA"}]},{"title":"Green Lantern","subtitle":"FXX : Interests,News","image_url":"http://image.vam.synacor.com.edgesuite.net/6a/87/6a8776d95edd4ddb86e12671362126b2f5401191/w=101,h=151,crop=auto/?sig=8a134321fc88e64e1a2a3be6c08992edbcb3f2bc9037aa5e5ad8f25f06f6c7c4&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Green Lantern Channel: FXX"}]},{"title":"Lethal Weapon","subtitle":"FOX WFXT : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/00/5a/005af22b717b512b276e71d3d4b4af578a313662/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Lethal Weapon  Channel: FOX WFXT"}]}]}}}},
       // data: {"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Family Guy","subtitle":"WBIN : Comedy","image_url":"http://image.vam.synacor.com.edgesuite.net/8d/53/8d532ad0e94c271f8fb153a86141de2c92ee15b0/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Family Guy Channel: WBIN"}]},{"title":"NCIS","subtitle":"USA : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/85/ed/85ed791472df3065ae5462d42560773a649fdfaf/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: NCIS Channel: USA"}]},{"title":"Green Lantern","subtitle":"FXX : Interests,News","image_url":"http://image.vam.synacor.com.edgesuite.net/6a/87/6a8776d95edd4ddb86e12671362126b2f5401191/w=101,h=151,crop=auto/?sig=8a134321fc88e64e1a2a3be6c08992edbcb3f2bc9037aa5e5ad8f25f06f6c7c4&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Green Lantern Channel: FXX"}]},{"title":"Shark Tank","subtitle":"CNBC : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Shark Tank Channel: CNBC"}]},{"title":"Lethal Weapon","subtitle":"FOX WFXT : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/00/5a/005af22b717b512b276e71d3d4b4af578a313662/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Lethal Weapon  Channel: FOX WFXT"}]}]}}}},
	//data : {"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Family Guy","subtitle":"WBIN : Comedy","image_url":"http://image.vam.synacor.com.edgesuite.net/8d/53/8d532ad0e94c271f8fb153a86141de2c92ee15b0/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Family Guy Channel: WBIN"}]},{"title":"NCIS","subtitle":"USA : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/85/ed/85ed791472df3065ae5462d42560773a649fdfaf/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: NCIS Channel: USA"}]},{"title":"Green Lantern","subtitle":"FXX : Interests,News","image_url":"http://image.vam.synacor.com.edgesuite.net/6a/87/6a8776d95edd4ddb86e12671362126b2f5401191/w=101,h=151,crop=auto/?sig=8a134321fc88e64e1a2a3be6c08992edbcb3f2bc9037aa5e5ad8f25f06f6c7c4&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Green Lantern Channel: FXX"}]},{"title":"Shark Tank","subtitle":"CNBC : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Shark Tank Channel: CNBC"}]},{"title":"Notorious","subtitle":"ABC WCVB : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/ba/51/ba51ba91eafe2da2a01791589bca98c0044b6622/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Notorious Channel: ABC WCVB"}]},{"title":"Chicago Med","subtitle":"NBC WHDH : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/e1/93/e1933b6aee82a467980415c36dced6fddf64d80a/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Chicago Med Channel: NBC WHDH"}]},{"title":"Modern Family","subtitle":"CW WLVI : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/c1/58/c1586d0e69ca53c32ae64526da7793b8ec962678/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Modern Family Channel: CW WLVI"}]},{"title":"Lethal Weapon","subtitle":"FOX WFXT : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/00/5a/005af22b717b512b276e71d3d4b4af578a313662/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Lethal Weapon  Channel: FOX WFXT"}]}]}}}},
	    data: {"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Family Guy","subtitle":"WBIN : Comedy","image_url":"http://image.vam.synacor.com.edgesuite.net/8d/53/8d532ad0e94c271f8fb153a86141de2c92ee15b0/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Family Guy Channel: WBIN"}]},{"title":"NCIS","subtitle":"USA : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/85/ed/85ed791472df3065ae5462d42560773a649fdfaf/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: NCIS Channel: USA"}]},{"title":"Shark Tank","subtitle":"CNBC : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Shark Tank Channel: CNBC"}]},{"title":"Notorious","subtitle":"ABC WCVB : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/ba/51/ba51ba91eafe2da2a01791589bca98c0044b6622/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Notorious Channel: ABC WCVB"}]},{"title":"Chicago Med","subtitle":"NBC WHDH : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/e1/93/e1933b6aee82a467980415c36dced6fddf64d80a/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Chicago Med Channel: NBC WHDH"}]},{"title":"Modern Family","subtitle":"CW WLVI : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/c1/58/c1586d0e69ca53c32ae64526da7793b8ec962678/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Modern Family Channel: CW WLVI"}]}]}}}},
	source: "Zero Service - app_zero.js"
    });
}

function acclinking(apireq)
{
	 console.log('Account Linking Button') ;
	 return (
	          {
		    speech: "Welcome! Link your Verizon Account.",
		    displayText: "Link Account",
		    data: {
				"facebook": {
					"attachment": {
						"type": "template",
						"payload": {
							"template_type": "button",
							"text": "Welcome! Link your Verizon Account.",
							 "buttons": [{
								    "type": "account_link",
								    "url": "https://www98.verizon.com/foryourhome/myaccount/ngen/upr/bots/preauth.aspx"
								  }]
							}
					}
				}
			},
			source: "Verizon.js"
		  }
	        );
}

function LinkOptionsNew(apireq)
{
    console.log('Calling from  link options:') ;
	
	var strRegionId =  apireq.body.result.parameters.RegionId;
        console.log('strRegionId:' + strRegionId) ;
	if (strRegionId != undefined  && strRegionId !='')
	{
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
									"title": "What's on tonight?",
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
	else
	{
		//console.log("User Not linked, henced asked to link with FB");
		var struserid = ''; 
			for (var i = 0, len = apireq.body.result.contexts.length; i < len; i++) {
				if (apireq.body.result.contexts[i].name == "sessionuserid") {

					 struserid = apireq.body.result.contexts[i].parameters.Userid;
					console.log("original userid " + ": " + struserid);
				}
			} 

			if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty	
		
		return (
			{
			speech: "Congrats, we got your details. Tap Continue to proceed.",
			displayText: "Link Account",
			data: {
				"facebook": {
					"attachment": {
						"type": "template",
						"payload": {
							"template_type": "button",
							"text": "Congrats, we got your details. Tap Continue to proceed.",
							"buttons": [
								{
									"type": "postback",
									"title": "Continue",
									"payload": "Userid : " + struserid + "  Regionid : 92377"
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
}



function CategoryList(apireq) {
	
	 	var pgNo = apireq.body.result.parameters.PageNo;
	
	var categlist={}
	
	switch(pgNo)
	{
		case '1':
			categlist={"facebook":
			{ "text":"Pick a category", 
			 "quick_replies":[ 
			//    "content_type":"text", "title":"Red", "payload":"red"
			    { "content_type": "text", "title":"Children & Family", "payload":"show Kids movies" }, 
			    { "content_type": "text", "title":"Action & Adventure", "payload":"show Action movies" }, 
			    { "content_type": "text", "title":"Documentary", "payload":"show Documentary movies" }, 
			    { "content_type": "text", "title":"Mystery", "payload":"show Mystery movies" },
			    { "content_type": "text", "title":"More Categories ", "payload":"show categories list pageno: 2" }
			 ] }};
			break;
		default :
		categlist={"facebook":
			{ "text":"I can also sort my recommendations for you by genre. Type or tap below", 
			 "quick_replies":[ 
			    { "content_type": "text", "payload":"show Comedy movies", "title":"Show Comedy movies" }, 
			    { "content_type": "text", "payload":"show Drama movies", "title":"Show Drama movies" }, 
			    { "content_type": "text", "payload":"show Sports program" , "title":"Show Sports program"}, 
			    { "content_type": "text", "payload":"show Sci-Fi movies" , "title":"Show Sci-Fi movies"},
			    { "content_type": "text", "payload":"show categories list pageno: 1" , "title":"More Categories "}
			 ] }};
			//categlist={"facebook":{"attachment":{"type":"template","payload":{"template_type":"text","text":"I can also sort my recommendations for you by genre. Type or tap below","quick_replies":[{"content_type":"text","payload":"Comedy","title":"Show Comedy movies"},{"content_type":"text","payload":"show Drama movies","title":"Show Drama movies"},{"content_type":"text","payload":"show Sports program","title":"Show Sports program"},{"content_type":"text","payload":"show Sci-Fi movies","title":"Show Sci-Fi movies"},{"content_type":"text","payload":"show categories list pageno: 1","title":"More Categories "}]}}}};
			//categlist={"facebook":{"message":{"text":"I can also sort my recommendations for you by genre. Type or tap below","quick_replies":[{"content_type":"text","payload":"Comedy","title":"Show Comedy movies"},{"content_type":"text","payload":"show Drama movies","title":"Show Drama movies"},{"content_type":"text","payload":"show Sports program","title":"Show Sports program"},{"content_type":"text","payload":"show Sci-Fi movies","title":"Show Sci-Fi movies"},{"content_type":"text","payload":"show categories list pageno: 1","title":"More Categories "}]}}};
			//categlist={"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":" Would you like to see some other TV Recommendations for tonight?","buttons":[{"type":"postback","title":"Show Recommendations","payload":"Show Recommendations"},{"type":"postback","title":"More Options","payload":"More Options"}]}},"quick_replies":[{"content_type":"text","payload":"Comedy","title":"Show Comedy movies"},{"content_type":"text","payload":"show Drama movies","title":"Show Drama movies"},{"content_type":"text","payload":"show Sports program","title":"Show Sports program"},{"content_type":"text","payload":"show Sci-Fi movies","title":"Show Sci-Fi movies"},{"content_type":"text","payload":"show categories list pageno: 1","title":"More Categories "}]}};
			//categlist={"facebook":{"attachment":{"type":"image","payload":{"url":"https://avatars2.githubusercontent.com/u/6422482?v=3&s=466"}},"quick_replies":[{"content_type":"text","title":"Next Image","payload":"YOUR_DEFINED_PAYLOAD_FOR_NEXT_IMAGE"}]}};
			//categlist={"facebook":{"attachment":{"type":"image","payload":{"url":"https://avatars2.githubusercontent.com/u/6422482?v=3&s=466"}},"quick_replies":[{"content_type":"text","payload":"Comedy","title":"Show Comedy movies"},{"content_type":"text","payload":"show Drama movies","title":"Show Drama movies"},{"content_type":"text","payload":"show Sports program","title":"Show Sports program"},{"content_type":"text","payload":"show Sci-Fi movies","title":"Show Sci-Fi movies"},{"content_type":"text","payload":"show categories list pageno: 1","title":"More Categories "}]}};
			//categlist={"facebook":{"quick_replies":[{"content_type":"text","title":"Red","payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Button_Icon_Red.svg/300px-Button_Icon_Red.svg.png"},{"content_type":"text","title":"Blue","payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_BLUE","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Button_Icon_Blue.svg/768px-Button_Icon_Blue.svg.png"},{"content_type":"location"}]}};
			break;
		}
	
	return{
		 speech: "I can also sort my recommendations for you by genre. Type or tap below",
        	displayText: "I can also sort my recommendations for you by genre. Type or tap below",
		data:categlist ,
        	source: "Verizon.js"
	};
	
} 

function firstMsg() {
	
	return{
		 speech: "Your Purchase is done",
        	displayText: "Your Purchase is done",
	};
	
} 

function secondMsg(apireq) {
  	console.log('inside secondMsg call ');
	//var stblst= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Select one of the STB from the below list, on which you like to record","buttons":[{"type":"postback","payload":"0000075999169227","title":"0000075999169227"}]}}}};
//{ "facebook": { "attachment": { "type": "template", "payload": { "template_type": "button", "text": "Select one of the STB from the below list, on which you like to record", "buttons":[ { "type": "postback", "payload": "0000060661164198", "title": "Living Room" } ]} } } }	
	//var stblst={"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Here is the program details you are looking for","buttons":[{"type":"postback","title":"84 - Bundesliga Highlights Show II -  Fox Sport 2 - Oct  4 2016 12:00AM - Sports &amp; Fitness","payload":"1"},{"type":"postback","title":"84 - World Poker Tour -  Fox Sport 2 - Oct  4 2016  1:00AM - SHOWS","payload":"1"},{"type":"postback","title":"84 - World Poker Tour -  Fox Sport 2 - Oct  4 2016  2:00AM - SHOWS","payload":"1"}]}}}};
	 //  stblst=   STBList(apireq,function (str) {STBListCallBack(str);  })

//var stblst={"facebook":{ "text":"Pick a color:", "quick_replies":[ { "content_type":"text", "title":"Red", "payload":"red" }, { "content_type":"text", "title":"Green", "payload":"green" } ] }};
 
var stblst={"facebook":{ "text":"Pick a color:", "quick_replies":[ { "content_type":"text", "title":"Red", "payload":"red", "image_url":"http://petersfantastichats.com/img/red.png" }, { "content_type":"text", "title":"Green", "payload":"green", "image_url":"http://petersfantastichats.com/img/green.png" }, { "content_type":"text", "title":"Blue", "payload":"blue", "image_url":"http://petersfantastichats.com/img/green.png" }, { "content_type":"text", "title":"yellow", "payload":"yellow", "image_url":"http://petersfantastichats.com/img/green.png" }, { "content_type":"text", "title":"i m trying big text", "payload":"green", "image_url":"http://petersfantastichats.com/img/green.png" }] }};
//+  {facebook.first_name} 
	return (
	 {
        speech: "Second Message",
        displayText: "Second Message",
	data:stblst ,
        source: "Verizon.js"
    	}  );
} 


function recommendTVNew(pgmtype,callback) { 
       	console.log('inside external call ');
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {
			Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			Request: {
				ThisValue: pgmtype, BotstrVCN:'3452'
			}
		}
	};
//https://www.verizon.com/fiostv/myservices/admin/testwhatshot.ashx 
	//https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function recommendTVNew1(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	//var subflow = objToJson;
	console.log("subflow :" + subflow)
    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: subflow,
        source: "Zero Service - app_zero.js"
    });

} 

function STBList(apireq,callback) { 
       	console.log('inside external call '+ apireq.body.contexts);
	var struserid = ''; 
	for (var i = 0, len = apireq.body.result.contexts.length; i < len; i++) {
		if (apireq.body.result.contexts[i].name == "sessionuserid") {

			 struserid = apireq.body.result.contexts[i].parameters.Userid;
			console.log("original userid " + ": " + struserid);
		}
	} 
	
	if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty
	
		console.log('struserid '+ struserid);
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'STBList',Userid:struserid} 
			}
		
	};
//https://www.verizon.com/fiostv/myservices/admin/testwhatshot.ashx 
	//https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function STBListCallBack(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	
	console.log("stblist :" + JSON.stringify(subflow))

    return ({
        speech: "Which STB would you like to record on?",
        displayText: "Which STB would you like to record on?",
        data: subflow,
        source: "Verizon.js"
    });

} 
function STBListCallBackNew(apiresp,callback) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;

	callback({
						speech: "Select one of the DVR from the below list, on which you like to record",
						displayText: "STB List",
						data: subflow,
						source: "Verizon.js"
					});

} 

function ChnlSearch(apireq,callback) { 
      var strChannelName =  apireq.body.result.parameters.Channel.toUpperCase();
	
	  console.log("strChannelName " + strChannelName);
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'ChannelSearch',BotstrStationCallSign:strChannelName} 
			}
		
	};
  console.log("json " + String(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function ChnlSearchCallback(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
	var chposition = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	
	console.log("chposition :" + chposition)
    return ({
        speech: "You can watch it on channel # " + chposition  ,
        displayText: "You can watch it on channel # " + chposition  ,
       // data: subflow,
        source: "Verizon.js"
    });

} 

function DVRRecord(apireq,callback) { 
	
	var strUserid = ''; 
	for (var i = 0, len = apireq.body.result.contexts.length; i < len; i++) {
		if (apireq.body.result.contexts[i].name == "sessionuserid") {

			 strUserid = apireq.body.result.contexts[i].parameters.Userid;
			console.log("original userid " + ": " + strUserid);
		}
	} 
	if (strUserid == '' || strUserid == undefined) strUserid='lt6sth2'; //hardcoding if its empty
		
         var strProgram =  apireq.body.result.parameters.Programs;
	 var strChannelName =  apireq.body.result.parameters.Channel;
	 var strGenre =  apireq.body.result.parameters.Genre;

	var strFiosId = apireq.body.result.parameters.FiosId;
	var strStationId =apireq.body.result.parameters.StationId  ;
	
	var strAirDate =apireq.body.result.parameters.date  ;
	var strAirTime =apireq.body.result.parameters.timeofpgm  ;
	var strDuration =apireq.body.result.parameters.Duration  ;
	
	var strRegionId =apireq.body.result.parameters.RegionId;
	var strSTBModel =apireq.body.result.parameters.STBModel  ;
	var strSTBId =apireq.body.result.parameters.SelectedSTB  ;
	
	var strVhoId =apireq.body.result.parameters.VhoId  ;
	var strProviderId =apireq.body.result.parameters.ProviderId  ;
	
	
	 console.log(" strUserid " + strUserid + "Recording strProgram " + strProgram + " strGenre " + strGenre + " strdate " +strAirDate + " strFiosId " +strFiosId + " strStationId " +strStationId  +" strAirDate " + strAirDate + " strAirTime " + strAirTime+ " strSTBId " +strSTBId + " strSTBModel " +strSTBModel+" strRegionId " +strRegionId+ " strDuration " +strDuration );
	
        var headersInfo = { "Content-Type": "application/json" };
	
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'DVRSchedule', 
				   Userid : strUserid,
				   BotStbId:strSTBId, 
				   BotDeviceModel : strSTBModel,
				   BotstrFIOSRegionID : '91629',
				   BotstrFIOSServiceId : strFiosId,
				   BotStationId : strStationId,
				   BotAirDate : strAirDate,
				   BotAirTime : strAirTime,
				   BotDuration : strDuration,
				   BotVhoId : strVhoId,
				   BotProviderId : strProviderId
				   } 
			}
		};
	
	 console.log("args " + JSON.stringify(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + JSON.stringify(body));
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 

function DVRRecordCallback(apiresp) {
     var objToJson = {};
    objToJson = apiresp;
try{
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	console.log(JSON.stringify(subflow));
	
	if (subflow !=null )
	{
		if (subflow.facebook.result.msg =="success" )
		{
		//var respstr = 'Your recording for "' + apiresp.body.result.parameters.Programs +  '"  on ' + apiresp.body.result.parameters.Channel  +' channel, has been scheduled at ' + apiresp.body.result.parameters.timeofpgm + ' on ' + apiresp.body.result.parameters.SelectedSTB + ' STB.';
		var respstr = 'Your recording has been scheduled.';		
		return ({
				speech: respstr + " Would you like to see some other TV Recommendations for tonight?",
				displayText: "TV Recommendations",
				data: {
					"facebook": {
					"attachment": {
					"type": "template",
					"payload": {
					"template_type": "button",
					"text": respstr + " Would you like to see some other TV Recommendations for tonight?",
					"buttons": [
					{
					"type": "postback",
					"title": "Show Recommendations",
					"payload": "Show Recommendations"
					},
					{
					"type": "postback",
					"title": "More Options",
					"payload": "More Options"
					}]}}}
				},
				source: "Verizon.js"
				});
		}
		else
		{// + subflow.facebook.errorPage.errormsg
		    return ({
			speech: "Sorry!, There is a problem occured in Scheduling( "+ subflow.facebook.result.msg + " ). Try some other.",
			displayText: "Sorry!, There is a problem occured in Scheduling( "+ subflow.facebook.result.msg + " ). Try some other.",
		     //   data: subflow,
			source: "Verizon.js"
		    });
		}
	}
	else
	{
		    return ({
			speech: "Sorry!, There is a problem occured in Scheduling. Try some other.",
			displayText: "Sorry!, There is a problem occured in Scheduling. Try some other.",
		     //   data: subflow,
			source: "Verizon.js"
		    });
	}
}
catch (err) 
{
console.log( "Error occured in recording: " + err);
	return ({
			speech: "Sorry!, There is a problem occured in Scheduling. Try some other.",
			displayText: "Sorry!, There is a problem occured in Scheduling. Try some other.",
		     //   data: subflow,
			source: "Verizon.js"
		    });
}
}

 /* 
function DVRRecordCallback(apiresp) {
     var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	console.log(JSON.stringify(subflow));
	
	if (subflow !=null )
	{
		console.log("result of record " +subflow.facebook.result);
		console.log("msg of record as node " +subflow.facebook.result.msg);
		console.log("msg of record as attr " +subflow.facebook.result["msg"]);
	
		//var respstr = 'Your recording for "' + apiresp.body.result.parameters.Programs +  '"  on ' + apiresp.body.result.parameters.Channel  +' channel, has been scheduled at ' + apiresp.body.result.parameters.timeofpgm + ' on ' + apiresp.body.result.parameters.SelectedSTB + ' STB.';
		var respstr = 'Your recording is successful.';		
		return ({
				speech: respstr + " Would you like to see some other TV Recommendations for tonight?",
				displayText: "TV Recommendations",
				data: {
					"facebook": {
					"attachment": {
					"type": "template",
					"payload": {
					"template_type": "button",
					"text": respstr + " Would you like to see some other TV Recommendations for tonight?",
					"buttons": [
					{
					"type": "postback",
					"title": "Show Recommendations",
					"payload": "Show Recommendations"
					},
					{
					"type": "postback",
					"title": "More Options",
					"payload": "More Options"
					}]}}}
				},
				source: "Verizon.js"
				});
	}
	else
	{// + subflow.facebook.errorPage.errormsg
		    return ({
			speech: "Sorry!, There is a problem occured in Scheduling. Try some other.",
			displayText: "Sorry!, There is a problem occured in Scheduling. Try some other.",
		     //   data: subflow,
			source: "Verizon.js"
		    });
	}
}

*/
function PgmSearch(apireq,callback) { 
         var strProgram =  apireq.body.result.parameters.Programs;
	 var strGenre =  apireq.body.result.parameters.Genre;
	 var strdate =  apireq.body.result.parameters.date;
	 var strChannelName =  apireq.body.result.parameters.Channel;
	 var strRegionId = "92377";
	 console.log("strProgram " + strProgram + "strGenre " + strGenre + "strdate " +strdate);
	
        var headersInfo = { "Content-Type": "application/json" };
	
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'AdvProgramSearch', 
				   BotstrTitleValue:strProgram, 
				   BotdtAirStartDateTime : strdate,
				   BotstrGenreRootId : strGenre,
				   BotstrStationCallSign:strChannelName,
				   BotstrFIOSRegionID : strRegionId
				  } 
			}
		};
	
	 console.log("args " + args);
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function PgmSearchCallback(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	
	
    return ({
        speech: "Here is the program details you are looking for" ,
        displayText: "Here is the program details you are looking for" ,
        data: subflow,
        source: "Verizon.js"
    });

} 

function upgradeDVR(apireq)
{
   var purchasepin =  apireq.body.result.parameters.purchasepin.toUpperCase();
   if (purchasepin !="" || purchasepin !=undefined )
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
                                "title": "What's on tonight?",
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
        speech: "Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts and notifications through messenger whenever you want. OR if you’re in a hurry send me your zip code/ VZID so that I can send you TV recommendations right away. Don’t worry – your personal information will not be shared with Facebook!",
        displayText: "Link Account",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        //"text": "Hey , welcome to Verizon! Want to know what’s on tonight?  I can answer almost anything, so try me! Also, if you want personalized alerts through Messenger link me to your Verizon account! ",
                      //  "text" : "Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts and notifications through messenger whenever you want. OR if you’re in a hurry send me your zip code/ VZID so that I can send you TV recommendations right away. Don’t worry – your personal information will not be shared with Facebook!",
			"text" :"Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts.",
			    "buttons": [
                            {
                                "type": "postback",
                                "title": "Link Account",
                                "payload": "Link Account"
                            },
			   {
                                "type": "postback",
                                "title": "Maybe later",
                                "payload": "Main Menu"
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

function getstblist(apireq,callback)
{
	STBList(apireq,
		function (str) {
			STBListCallBackNew(str,callback);
			});
}

function record(apireq)
{
	
var channel = apireq.body.result.parameters.Channel.toUpperCase() ;
var program = apireq.body.result.parameters.Programs.toUpperCase();
var time = apireq.body.result.parameters.timeofpgm;
var dateofrecord = apireq.body.result.parameters.date;
var SelectedSTB = apireq.body.result.parameters.SelectedSTB;
	console.log("SelectedSTB  :  "+  SelectedSTB + " channel : " + channel + " dateofrecord :" + dateofrecord +" time :" + time);
if (time == "")
{
return (
	
	
	{
        speech: " I see the below schedules for " + program +". Tap on which time you like to record",
        displayText: "Subscribe",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text":  " I see the below schedules for " + program +". Tap on which time you like to record",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "12:30",
                                "payload": "12:30"
                            },
                            {
                                "type": "postback",
                                "title": "10:30",
                                "payload": "12:30"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });		
	
}

else if (channel == 'HBO')
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
else if (SelectedSTB == "" || SelectedSTB == undefined)
{
 //STBList(apireq,function (str) {STBListCallBack(str);  }); 

//return secondMsg()

return ({
        speech: "Select one of the DVR from the below list, on which you like to record",
        displayText: "Subscribe",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text":  "Select one of the DVR from the below list, on which you like to record",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Living Room",
                                "payload": "0000060661164198"
                            },
                            {
                                "type": "postback",
                                "title": "Bed Room",
                                "payload": "0000060661164199"
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
                        "text": " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
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
var respstr ='Your recording for "' + apireq.body.result.parameters.Programs +'" has been scheduled at '+ apireq.body.result.parameters.timeofpgm + ' on ' + apireq.body.result.parameters.SelectedSTB + ' STB.';
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
                                "title": "More Options",
                                "payload": "More Options"
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

function channelsearch(apireq) {
    
var chnNo= Math.floor(Math.random() * (500 - 1) + 1);
var channel = apireq.body.result.parameters.Channel.toUpperCase() ;
	
   return (
	   
	   {
        speech: "You can watch " + channel + "  on Channel Number : "+ chnNo ,
        displayText: "You can watch " + channel + "  on Channel Number : "+ chnNo ,
        source: "Verizon.js"
    	}
	 /*  {
        speech: "Second Message You can watch " + channel + "  on Channel Number : "+ chnNo ,
        displayText: "Second Message You can watch " + channel + "  on Channel Number : "+ chnNo ,
        source: "Verizon.js"
    }*/
	  
	  
	  
	  );

} 

function programSearch(apireq) {
   var program = apireq.body.result.parameters.Programs.toUpperCase(); 
return ({
        speech: " I see the below schedules for " + program +". Tap on which time you like to record",
        displayText: "Subscribe",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text":  " I see the below schedules for " + program +". Tap on which time you like to record",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "HBO HD Channel 5  - 12:30 EST ",
                                "payload": "HBO HD Channel 5  - 12:30 EST ",
                            },
                            {
                                "type": "postback",
                                "title": "HBO SD Channel 15  - 10:30 EST ",
                                "payload": "HBO SD Channel 15  - 10:30 EST ",
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });		

} 

//------------------dummy methods
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

function recommendTVStg(callback) { 
       	console.log('inside external call ');
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {
			Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			Request: {
				ThisValue: 'Trending1'
			}
		}
	};

    request.post("https://www98.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 

function welcomeInit()
{
  var username="";
  return (
      { speech: " Hey "+ username +"Welcome to Verizon!",
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
