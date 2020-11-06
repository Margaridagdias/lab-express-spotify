require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    // Our routes go here:


    //Entry point of our application
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/artist-search', (req, res) => {

        //I want to get here the text I typped on the form input
        let artistName = req.query.artist; //it's req.query because it comes
        // from a form
        spotifyApi
            .searchArtists(artistName) //beatles //rolling stones //etc.
                .then(data => {
                    console.log('The received data from the API: ', data.body.artists.items);
                    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
                    res.render('artist-search-results', { artistsList: data.body.artists.items});
                })
                .catch(err => console.log('The error while searching artists occurred: ', err));
    });

    app.get('/albums/:artistId', (req, res) => {
        let artistId = req.params.artistId; //use route params when using
        //a link href 

        spotifyApi.getArtistAlbums(artistId)
            .then((data) => {
                console.log('The received data from the API', data.body);
                let albumsResults = data.body.items;
                
                albumsResults[0].name = 'bla bla bla';
                
                res.render('albums', { albums: albumsResults});
            });
    });

    
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
