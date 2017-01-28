// modules =================================================
var express = require('express')     // framework d'appli
var app = express()
var bodyParser = require('body-parser') // BodyParser pour POST
var http = require('http').Server(app)      // préparer le serveur web
var dotenv = require('dotenv')
var path = require('path')
var opn = require('opn')
var localtunnel = require('localtunnel')

// configuration ===========================================

// load environment variables,
// either from .env files (development),
// heroku environment in production, etc...
dotenv.load()

app.use(express.static(path.join(__dirname, '/public')))

// parsing
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing url encoded

// view engine ejs
app.set('view engine', 'ejs')

// routes
require('./app/routes/routes')(app)

// port for Heroku
app.set('port', (process.env.PORT || 5000))

// LOCALTUNNEL ===================================================
if (process.env !== 'production') {
  var tunnel = localtunnel(app.get('port'), { subdomain: 'syscoassist' }, function(err, tunnel) {
    let log = err ? `tunnel failz....... ${err}` : `everyday im tunnelin...... ${tunnel.url}`;
    console.log(log);
    if (!err) {
      opn(tunnel.url);
    }
});

tunnel.on('close', function() {
  // tunnels are closed
  console.log(`tunnelin......finished..... ${tunnel.url}`);
});
}

// START ===================================================
http.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'))
})
