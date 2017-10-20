var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

menuSwitch(process.argv.slice(2,4));

function menuSwitch(args){

    var arg1 = args[0];
    var arg2 = "";

    switch(arg1) {
        case "my-tweets":
            showTweets();
            break;
        case "spotify-this-song":
            arg2 = args[1];
            showSong(arg2);
            break;
        case "movie-this":
            arg2 = args[1];
            showMovie(arg2);
            break;
        case "do-what-it-says":
            arg2 = args[1];
            doFile(arg2);
            break;
        default:
            console.log("Not a supported option.");
            break;
    }
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
            return console.log("Error occurred: " + error);
        }
    });
}

function showSong(song){

    if(song === undefined){
        var searchObj = { type: 'track', query: "The Sign Ace of Base", limit: 1 }
    } else {
        var searchObj = { type: 'track', query: song }
    }

    var spotify = new Spotify({
        id: keys.spotifyKeys.client_id,
        secret: keys.spotifyKeys.client_secret
    });

    spotify.search(searchObj, function(error, data) {

        if (!error) {

            if(data.tracks.items){

                for(var i=0; i < data.tracks.items.length; i++){

                    var artists = {};
                    for(var j=0; j < data.tracks.items[i].artists.length; j++){

                        var key = data.tracks.items[i].artists[j].name;
                        if(artists[key]){
                            artists[key] = 1;
                        } else{
                            artists[key] += 1;
                        }
                    }
                    console.log("Artist(s): " + Object.keys(artists).join(", "));
                    console.log("Name: " + data.tracks.items[i].name);
                    console.log("URL: " + data.tracks.items[i].preview_url);
                    console.log("Album: " + data.tracks.items[i].album.name + "\n");
                }
            }

        } else{
            return console.log("Error occurred: " + error);
        }
     
    });

}

function showMovie(movie){

    if(movie === undefined){
        movie = "Mr. Nobody";
    }

    request("http://www.omdbapi.com/?t="+movie+"&plot=short&apikey=40e9cece", function (error, response, body) {
      
        if(!error && response.statusCode === 200){

            var data = JSON.parse(body);
            console.log("Title: " + data.Title);
            console.log("Year: " + data.Year);
            console.log("IMDB Rating: " + data.imdbRating);
            console.log("Country: " + data.Country);
            console.log("Language: " + data.Language);
            console.log("Plot: " + data.Plot);
            console.log("Actors: " + data.Actors);
        } else{
            console.log("Error occurred: " + error);
        }

    });

}

function doFile(filename){

    if(filename === undefined){
        filename = "random.txt";
    }

    fs.readFile(filename, "utf8", function(error, data) {

        if (!error) {
            var dataArr = data.split(",");
            menuSwitch(dataArr.slice(0,2));
        } else{
            console.log("Error occurred: " + error);
        }
    });
}
