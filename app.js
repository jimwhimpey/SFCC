var express = require('express'),
    exphbs  = require('express3-handlebars'),
    sass    = require('node-sass'),
    app     = express();

// Handlebars setup
app.engine('handlebars', exphbs({	defaultLayout: 'main',
									partialsDir: 'views/partials/'}));
app.set('view engine', 'handlebars');

// Add SASS compiling
app.configure(function () {
	app.use(sass.middleware({
		src: 'styles', 
		dest: __dirname + '/public', 
		debug: false,
		output_style: 'compressed'
	}));
	app.use('/public', express.static(__dirname + '/public'));
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
	res.render('forum', {'type': 'page'});
});

app.get('/contact', function(req, res){
	res.render('contact', {'type': 'page'});
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});