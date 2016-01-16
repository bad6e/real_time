const http = require('http');
const express = require('express');
const app = express();
const _ = require('lodash');
const exphbs  = require('express-handlebars');
const PollStorage = require('./lib/pollstorage')
const bodyParser = require('body-parser');
const key = require('./lib/key')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'))

const port = process.env.PORT || 3000;
const server = http.createServer(app)
               .listen(port, function(){
                console.log('Listening on port ' + port + '.');
               });
const socketIo = require('socket.io');
const io = socketIo(server);

pry = require('pryjs')

var pollStorage = new PollStorage;
var votes = {};
var votesTally = {};

//Routes
app.get("/", function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/polls/:id', function(req , res){
  var id = req.params.id
  var data = pollStorage.polls[id].items;
  res.render('polls', {data, id} );
});

app.get('/polls/admin/:id', function(req , res){
  var id = req.params.id
  var data = pollStorage.polls[id];
  res.render('admin', {id});
});

app.post('/', function(request, response) {
  var uniqueKey = key.generateUniqueKeyForPoll();
  pollStorage.createPoll(request.body, uniqueKey)
  response.redirect('/polls/admin/' + uniqueKey);
});

//Socket IO
io.on('connection', function(socket){
  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      var socketId = socket.id
      io.sockets.emit('voteCount-' + message.key,
                                     pollStorage.voteSorter(message,
                                     votes,
                                     votesTally,
                                     socketId))
    }
    console.log(votes)
  });
});

module.exports = server;