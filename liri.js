var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var logfile = "./log.txt"
var prompt = "Valid commands are: " + "\n" +
             "    my-tweets" + "\n" +
             "    spotify-this-song <song name>" + "\n" +
             "    movie-this <movie title>" + "\n" +
             "    do-what-it-says";


if(process.argv.length > 4){
    console.log(prompt);
    console.log("\n(Please use quotes around your song name or movie title.)");
} else{
    menuSwitch(process.argv.slice(2,4));
}

function menuSwitch(args){

    switch(args[0]) {
        case "my-tweets":
            cmd = "my-tweets";
            showTweets();
            break;
        case "spotify-this-song":
            showSong(args[1]);
            break;
        case "movie-this":
            showMovie(args[1]);
            break;
        case "do-what-it-says":
            doFile(args[1]);
            break;
        default:
            console.log("Not a supported option!\n");
            console.log(prompt);
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

        var result = "";

        if (!error) {

          for(var i=0; i < tweets.length; i++){
              result += tweets[i].text + "\n";
          }

        } else{
            result = "Error occurred: " + error;
        }

        logResults("my-tweets", result);
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

        var result = "";

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
                    result += "Artist(s): " + Object.keys(artists).join(", ") + "\n";
                    result += "Name: " + data.tracks.items[i].name + "\n";
                    result += "URL: " + data.tracks.items[i].preview_url + "\n";
                    result += "Album: " + data.tracks.items[i].album.name + "\n\n";
                }
            }

        } else{
            result = "Error occurred: " + error;
        }

        logResults("spotify-this-song", result);
    });

}

function showMovie(movie){

    if(movie === undefined){
        movie = "Mr. Nobody";
    }

    request("http://www.omdbapi.com/?t="+movie+"&plot=short&apikey=40e9cece", function (error, response, body) {
      
        var result = "";

        if(!error && response.statusCode === 200){

            var data = JSON.parse(body);
            result += "Title: " + data.Title + "\n";
            result += "Year: " + data.Year + "\n";
            result += "IMDB Rating: " + data.imdbRating + "\n";
            result += "Country: " + data.Country + "\n";
            result += "Language: " + data.Language + "\n";
            result += "Plot: " + data.Plot + "\n";
            result += "Actors: " + data.Actors + "\n";
        } else{
            result = "Error occurred: " + error;
        }

        logResults("movie-this", result);
    });

}

function doFile(filename){

    var result = "";

    if(filename === undefined){
        filename = "random.txt";
    }

    fs.readFile(filename, "utf8", function(error, data) {

        if (!error) {
            var dataArr = data.split(",");
            menuSwitch(dataArr.slice(0,2));
        } else{
            result = "Error occurred: " + error;
        }
    });

    if(result !== ""){
        logResults("do-what-it-says "+filename, result);
    }
}

function logResults(command, results){

    console.log(results);

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var timestamp = (new Date(Date.now() - tzoffset)).toISOString().replace(/T|Z/gi, " ");
 
    fs.appendFile(logfile, timestamp + ">>\n\n" + 
                           command + "\n\n" +
                           results + "\n\n", function(error) {

        if(error) {
            console.log(error);
        }

    });
}
