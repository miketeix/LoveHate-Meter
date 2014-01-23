var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , twitter = require('ntwitter')
  , io = require('socket.io').listen(server)
  , serialPort = require('./modules/serial_node')
  , currentStream
  , loveTweetCount = 0
  , hateTweetCount = 0;

server.listen(80);

app.use('/public', express.static(__dirname + "/public"));

  
app.get('/', function (req, res) {

queryString = req.query["q"];
console.log(queryString);

  res.sendfile(__dirname + '/public/index.html');


startLoveTwitStream();
startHateTwitStream();
  
});


 setInterval(getTweetRate,1000);  

 function getTweetRate(){
	console.log("loveTweetCount: ", loveTweetCount);
	console.log("hateTweetCount: ", hateTweetCount);
	
	//send Tweets-per-second to Arduino
	serialPort.sendTweetRate("l"+loveTweetCount);
	serialPort.sendTweetRate("h"+hateTweetCount);

	loveTweetCount = 0;
	hateTweetCount = 0;

 }


function startLoveTwitStream (){
	
	var loveTwit = new twitter({
	  consumer_key: '',
	  consumer_secret: '',
	  access_token_key: '',
	  access_token_secret: ''
  
 	 });
  
	loveTwit.stream('statuses/filter', { track: ['love'] }, function(stream) {
		
		currentStream = stream;
		  
	    stream.on('data', function (data) {
	  		
	    	loveTweetCount++;

			io.sockets.volatile.emit('loveTweet', {
				pic: data.user.profile_image_url,
			  user: data.user.screen_name,
			  text: data.text
			  
			});
	    });
			 
	});
	  
}


function startHateTwitStream (){
	
	var hateTwit = new twitter({
	  consumer_key: '',
	  consumer_secret: '',
	  access_token_key: '',
	  access_token_secret: ''
  
 	 });
  
	hateTwit.stream('statuses/filter', { track: ['hate'] }, function(stream) {
		
	    stream.on('data', function (data) {

	    	hateTweetCount++;

			io.sockets.volatile.emit('hateTweet', {
				pic: data.user.profile_image_url,
			 	user: data.user.screen_name,
			 	text: data.text
			  
			});
	    });
			  
	});
	  
}





  



