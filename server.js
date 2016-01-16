const http = require('http');
const express = require('express');
const app = express();
const _ = require('lodash');
const exphbs  = require('express-handlebars');
const PollStorage = require('./lib/pollstorage')

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


//Socket IO
io.on('connection', function(socket){
  socket.on('message', function (channel, message) {
    if (channel === 'poll item') {
      socket.emit('poll item', message);
    } else if (channel === 'generate poll'){
      var uniqueKey = generateUniqueKeyForPoll();
      pollStorage.createPoll(message, uniqueKey)
      socket.emit('generate poll', uniqueKey);
    } else if (channel === 'voteCast') {
      var socketId = socket.id
      io.sockets.emit('voteCount-' + message.key, pollStorage.voteSorter(message, votes, votesTally, socketId))
    }
  });

  function generateUniqueKeyForPoll (){
    return Math.random().toString(16).slice(2)
  }
});

module.exports = server;