var express = require('express'),
    exphbs  = require('express3-handlebars'),
    sass    = require('node-sass'),
    Instagram = require('instagram-node-lib'),
    app     = express(),
    http    = require("http"),
    https    = require("https"),
    parser  = require('xml2js').parseString,
    moment  = require('moment'),
    urlParser = require('url');

// Handlebars setup
app.engine('handlebars', exphbs({	defaultLayout: 'main',
									partialsDir: 'views/partials/'}));
app.set('view engine', 'handlebars');

// Add SASS compiling
app.configure(function () {
	if (typeof(process.env.NODE_ENV) === 'undefined') {
		app.use(sass.middleware({
			src: 'styles',
			dest: __dirname + '/public',
			debug: true,
			output_style: 'nested'
		}));
	}
	app.use(express.static(__dirname + '/public'));
});

// Set up Instagram
Instagram.set('client_id', '5ab281c8bab24eaaa37f9ae7f3f0517a');
Instagram.set('client_secret', '2c0d887e9dd9427888765b54e4872685');

app.get('/', function(req, res){
	res.render('home', {'type': 'page'});
});

app.get('/instagram', function(req, res) {
	Instagram.tags.recent({
		name: 'sfcyclingclub',
		complete: function(data) {
			res.send(data);
		}
	});
});

app.get('/about', function(req, res){
	res.render('about', {'type': 'page'});
});

app.get('/rides', function(req, res){
	res.render('rides', {'type': 'page'});
});

app.get('/membership', function(req, res){
	res.render('membership', {'type': 'page'});
});

app.get('/forum', function(req, res){
	res.redirect('http://sfccforum.org');
});

app.get('/contact', function(req, res){
	res.render('contact', {'type': 'page'});
});

app.get('/rides-calendar', function(req, response){

	var url = 'https://www.googleapis.com/calendar/v3/calendars/ktihar6uvc0lc1odtovk41fklo@group.calendar.google.com/events';
	url += "?key=AIzaSyCDwjXV97tycQggoNhNjOwmaphpgoo39PA";
	url += '&maxResults=12';
	url += '&singleEvents=true';
	url += '&orderBy=startTime';
	url += '&timeMin=' + moment().format();

	https.get(url, function(res) {
	
		var data = "",
			calendar = [];

		// Chunk the data together piece by piece as it gets returned
		res.on("data", function (chunk) {data += chunk; });
		
		// // Once all the data is returned
		res.on("end", function () {
			
			// Parse the string into JSON
			data = JSON.parse(data);
			
			// Loop through it
			for (var i=0; i < data.items.length; i++) {
	
				var time, timeFormatted, timeRelative;
				
				if (typeof data.items[i].start.dateTime == "undefined") {
					time = moment(data.items[i].start.date);
					timeFormatted = time.format("dddd, MMMM Do");
				} else {
					time = moment(data.items[i].start.dateTime);
					timeFormatted = time.format("dddd, MMMM Do, h:mma");
				}
				
				timeRelative = time.fromNow();
				
				var recuring = (typeof data.items[i].recurringEventId == "undefined") ? false : true;
	
				calendar.push({
					"timestamp": time.format("X"),
					"date": timeFormatted,
					"dateRelative": (timeRelative == "in a day") ? "tomorrow" : timeRelative,
					"title": data.items[i].summary,
					"where": data.items[i].location,
					"description": data.items[i].description,
					"recuring": recuring
				});
				
			};
			
			response.render('rides-calendar', {'type': 'page', 'calendar': calendar});
			
		});
		
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});