var express = require('express'),
    exphbs  = require('express3-handlebars'),
    sass    = require('node-sass'),
    app     = express(),
    http    = require("http"),
    parser  = require('xml2js').parseString,
	moment  = require('moment');;

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


app.get('/', function(req, res){
	res.render('home', {'type': 'home'});
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

app.get('/calendar', function(req, response){
	
	var options = {
	  host: 'www.google.com',
	  path: '/calendar/feeds/ktihar6uvc0lc1odtovk41fklo%40group.calendar.google.com/public/full',
	  port: 80
	};
	
	function compare(a,b) {
		if (a.timestamp < b.timestamp)
			return -1;
		if (a.timestamp > b.timestamp)
			return 1;
		return 0;
	}
	
	http.get(options, function(res) {
	
		var data = "",
			calendar = [];
	
		// Chunk the data together piece by piece as it gets returned
		res.on("data", function (chunk) {data += chunk; });
		
		// Onse all the data is returned
		res.on("end", function () {
			
			// Parse it with XML2JS
			parser(data, function (err, result) {
				
				// Loop trhough it
				for (var i=0; i < result.feed.entry.length; i++) {
					
					console.log("=============================");
					console.log(result.feed.entry[i].title[0]._);
					
					var time = moment(result.feed.entry[i]['gd:when'][0]['$'].startTime);
					
					calendar.push({
						"timestamp": time.format("X"),
						"date": time.format("dddd, MMMM Do, h:mma"),
						"title": result.feed.entry[i].title[0]._,
						"where": result.feed.entry[i]['gd:where'][0]['$'].valueString
					});
				};
				
				calendar.sort(compare);
				
				response.render('calendar', {'type': 'page', 'calendar': calendar});
				
			});
			
		});
		
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
	
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});