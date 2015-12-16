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

app.get('/racing', function(req, res){
	res.render('racing', {'type': 'page'});
});

app.get('/friends-of-tam', function(req, res){
	res.render('friends-of-tam', {'type': 'page'});
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

app.get('/docs', function(req, res){
	res.redirect('https://drive.google.com/a/sfcycle.org/folderview?id=0B8hzW4MiUJSCV1pIelFPckhuakE&usp=sharing');
});

app.get('/rides-calendar', function(req, response){

	response.render('rides-calendar', {'type': 'page', 'calendar': {}});

});

// Helpers

function replaceURLWithHTMLLinks(text) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp,"<a href='$1'>$1</a>");
}

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});