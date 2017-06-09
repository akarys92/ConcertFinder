var request = require('request'); 
var bodyParser = require('body-parser'); 
var rp = require('request-promise');

function spotifyController() {
    var key = "";
    var artists_list = [];
    /*** Public Methods ***/
    this.getArtists = function(req, res){
        key = req.body.access_key;
        
        var url = 'https://api.spotify.com/v1/me/top/tracks?limit=25';
        var topTracks = getTopTracks(key, [], url);
        var playListTracks = getPlayLists(key, [], "");

        var promises = [];
        promises.push(topTracks);
        promises.push(playListTracks);

        Promise.all(promises).then(function(values){
            //console.log("Top tracks = " + values);
            //var tracks = tracks2artists(values[0]);
            artists_list = reduceArtists(artists_list);

            res.send({artists: artists_list});
        });
    }

    this.test = function(req, res){
        key = req.body.access_key;
        //console.log(key);
        getPlayLists(key, [], "").then(function(artists){
            artists_list = reduceArtists(artists_list);
            res.send({artists: artists_list});
        });
    }

    /*** Private Methods ***/
    // Playlist helpers
    function getPlayLists(access_key, arr, url){
       // console.log(key);
        if(url == ""){    
            url = 'https://api.spotify.com/v1/me/playlists';
        }
        var options = {
            method: 'GET',
            url: url,
            headers: { 'Authorization': 'Bearer ' + key },
            json: true
        };
        // Get all playlists
        return rp(options).then(function(body){
            if(body.next) {
                //console.log("Body found.");
                return getPlayLists(key, arr.concat(body.items), body.next)
            }
            else {
                
                if(body.items) {
                    //console.log("No body found" + arr.concat(body.items));
                    return Promise.resolve(arr.concat(body.items));
                }
                else {
                    return Promise.resolve(arr);
                }
            }
        }).then(getPlaylistData);
    }

    function getPlaylistData(body){
        var promises = [];
        for(var i in body){
            var track = body[i];
            var url = track.href;
            var options = {
                method: 'GET',
                url: url + '/tracks?offset=0&limit=100',
                headers: { 'Authorization': 'Bearer ' + key },
                json: true
            };
            promises.push(rp(options));
        }
        return Promise.all(promises).then(function(values){
            var allArtists = [];
            for(var j in values){
                //console.log(values[j]);
                var list = values[j].items;
                allArtists.join(playlist2artists(list));
            }
            Promise.resolve(allArtists);
        });
    }
    
    // Top Tracks helpers
    function getTopTracks(access_key, arr, url) {
        var options = {
            method: 'GET',
            url: url,
            headers: { 'Authorization': 'Bearer ' + key },
            json: true
        };

        return rp(options).then(function(body){
            if(body.next) {
                //console.log("Body found.");
                return getTopTracks(key, arr.concat(body.items), body.next)
            }
            else {
                
                if(body.items) {
                    //console.log("No body found" + arr.concat(body.items));
                    return Promise.resolve(arr.concat(body.items));
                }
                else {
                    return Promise.resolve(arr);
                }
            }
        });
    }

    function reduceArtists(artists){
        var map = {};
        var output = [];
        //console.log(artists);
        for(var i in artists){
            var artist = artists[i];
            if(!(artist.name in map)){
                map[artist.name] = true;
                output.push(artist.name);
            }
        }
        return output;
    }

    // Foo 2 Artist
    function tracks2artists(tracks){
        var artists = [];
        for(var track in tracks){
            //console.log(tracks[track]);
            var artist = tracks[track].artists[0];
            //console.log(artist.name);
            var out = {
                name: artist.name,
                id: artist.id
            }
            artists_list.push(out);
        }
        return artists;
    }
    
    function playlist2artists(tracks){
        var artists = [];
        for(var track in tracks){
            //console.log(tracks[track]);
            var currTrack = tracks[track].track;
            for(var ar in currTrack.artists){
                var thisArtist = currTrack.artists[ar];
                var out = {
                    name: thisArtist.name,
                    id: thisArtist.id
                }
                artists_list.push(out);
            }
        }
        //console.log(artists);
        return artists;
    }
}

module.exports = new spotifyController();
