var express = require('express'),
    exphbs  = require('express3-handlebars'),
    app     = express();

// Handlebars setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
	res.render('home');
});

app.listen(3000);
console.log('Listening on port 3000');