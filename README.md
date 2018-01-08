# LIRI Node App

LIRI is like iPhone's SIRI except it is a Language Interpretation and Recognition Interface. Its command line interface is a Node.js app that takes input parameters and returns the requested data. A log of previously executed commands is kept.

Valid commands are: 

Command | Description
------------ | -------------
**my-tweets** | Shows your last 20 tweets with timestamps.
**spotify-this-song** *'song name'* | Retrieves song information from Spotify.
**movie-this** *'movie title'* | Outputs movie information from the OMDB API.
**do-what-it-says** | Runs any of the previous commands listed in a text file.
