var express = require('express'),
    exphbs  = require('express3-handlebars'),
    sass    = require('node-sass'),
    app     = express();

// Handlebars setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Add SASS compiling
app.configure(function () {
	app.use(sass.middleware({
		src: 'styles', 
		dest: __dirname + '/public', 
		debug: true,
		output_style: 'compressed'
	}));
	app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
	res.render('home');
});

app.listen(3000);
console.log('Listening on port 3000');