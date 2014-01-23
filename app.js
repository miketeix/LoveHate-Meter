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

 // port.listenToArduino();

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
	  consumer_key: 'WtaezZtuOO3NvP6kh1XGCw',
	  consumer_secret: 'C9BbUzEwJ1zrYxfe3UCI75KNcURKKHInv4DqqQ4Y',
	  access_token_key: '385230064-LTygDXHgEigBK2pwey39WXDMuGgFxG2iHAtdjbus',
	  access_token_secret: 'qiIAVWmoS4pV0E23AvFJD53lNSNdoUjkH1EDCJOTA'
  
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
	  consumer_key: 'GBcEzqYEs0nzptPS36nugQ',
	  consumer_secret: 'kjYX9zNY8yUyyWX1oggC76yJaSma3AwLrMTrAJIu0',
	  access_token_key: '1258196060-3st5HJCw9suaoG3CWGWpzrn6mZGBd9zPfIfggas',
	  access_token_secret: 'e8urFvZw9wIWGmTkMjCWPE2wLBteAklSUK7fAajF8'
  
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





  



