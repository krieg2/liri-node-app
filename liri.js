var keys = require("./keys.js");
var Twitter = require('twitter');

var arg = process.argv[2];

switch(arg) {
    case "my-tweets":
        showTweets();
        break;
    case "spotify-this-song":
        showSong();
        break;
    case "movie-this":
        showMovie();
        break;
    case "do-what-it-says":
        break;
}


function showTweets(){

    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = {screen_name: 'kriegapp',
                  count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (!error) {

          for(var i=0; i < tweets.length; i++){
              console.log(tweets[i].text);
          }

        } else{
            console.log(error);
        }
    });
}
