var ticketmaster = require("ticketmaster");
var request = require('request'); 
var bodyParser = require('body-parser'); 
var rp = require('request-promise');
var config = require ('../config/ticketmaster_config.json');

function TicketmasterController() {
    var api_key = config['api_keys']; 
    var latlong = "47.620506,-122.349277"; // Hard coded for seattle for now
    /*** Public Methods ***/
    this.getAll = function(req, res) {
        var artists = req.body.artists;
        //console.log(artists);
        var events = findEvents(artists);
        events.then(function(body){
            var allEvents = createEventsArr(body);
            res.send({count: allEvents.length, events: allEvents})
        });
    }
    
    /*** Private Methods */
    function findEvents (artists) {
        var promises = [];
        
        for(var i in artists) {
            var artist = artists[i];
            var key = randomKey();
            console.log(key);
            var options = {
                method: 'GET',
                url: "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artist + "&latlong=" + latlong + "&apikey="+ key,
                json: true
            };
            //console.log(options.url);
            promises.push(rp(options));
        }
        return Promise.all(promises).then(function(body){
            return body;
        });
    }

    function createEventsArr(events) {
        //console.log("Length: " + events.length);
        var allEvents = [];

        for(var i in events) {
            var currEvent = events[i];
            console.log("Event: " + stringify(currEvent));
            // Only try to proceed if results came back
            if(currEvent.page.totalPages > 0) {
                var event_group = createEventsObj(events[i]);
                //console.log(stringify(event_group));
                allEvents = allEvents.concat(event_group);
            }
        }
        return allEvents;
    }
    function createEventsObj(rawEvent) {
        /** Info I want:
         * artist
         * venue
         * date
         * price range
         * link to tickets
         */
        rawEvent = rawEvent._embedded.events;
        console.log("Event: " + stringify(rawEvent));
        var events = [];
        for(var i in rawEvent) {
            var event = rawEvent[i];
            //console.log("This Event: " + stringify(event));
            var obj = {
                artist: event.name,
                tmID: event.id,
                link: event.url,
                images: event.images,
                date: event.start,
                time: event.start,
                pricing: event.priceRanges,
                venue: event._embedded.venues[0]
            }
            events.push(obj);
        }
        //console.log("Events List: " + stringify(events));
        return events;
    }

    /*** Random helpers ***/
    function stringify(obj) {
        return JSON.stringify(obj, null, 4)
    }

    function randomKey() {
        var length = api_key.length;
        var rand = Math.random();
        rand = rand * 35;
        var num = Math.floor(rand);
        console.log(num);
        var index = num % length;
        console.log(index);
        return api_key[index];
    }
}

module.exports = new TicketmasterController();