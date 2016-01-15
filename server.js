const http = require('http');
const express = require('express');
const app = express();
const _ = require('lodash');
const exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

pry = require('pryjs');

app.use(express.static('public'))

app.get("/", function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
               .listen(port, function(){
                console.log('Listening on port ' + port + '.');
               });

const socketIo = require('socket.io');
const io = socketIo(server);

var polls = {};
var votes = {};
var votesTally = {};

app.get('/polls/:id', function(req , res){
  var id = req.params.id

  var foundId = _.find(Object.keys(polls) , function(d) {
    return d === req.params.id
  });

  if (!foundId) {
    console.log('bad id');
    res.status(404).end();
  } else {
    var data = pollData(id).items;
    res.render('polls', {data, id} );
  }
});

app.get('/polls/admin/:id', function(req , res){
  var id = req.params.id

  var foundId = _.find(Object.keys(polls) , function(d) {
    return d === req.params.id
  });

  if (!foundId) {
    console.log('bad id');
    res.status(404).end();
  } else {
    var data = pollData(id);
    res.render('admin', {id});
  }
});

function pollData (id) {
  return polls[id]
}

io.on('connection', function(socket){

  socket.on('message', function (channel, message) {
    if (channel === 'poll item') {
      socket.emit('poll item', message);
    } else if (channel === 'generate poll'){
      var uniqueKey = generateUniqueKeyForPoll();
      polls[uniqueKey] = message;
      socket.emit('generate poll', uniqueKey);
    } else if (channel === 'voteCast') {
      assignVotesToSpecificPoll(message);
      countVotes(votes);
      fiterVotesByMessageKey(message);
    }
  });

  function assignVotesToSpecificPoll (message) {
    if (votes[message.key] === undefined){
        var specificUsersVote = {};
        specificUsersVote[socket.id] = message.value;
        votes[message.key] = specificUsersVote;
      } else {
        votes[message.key][socket.id] = message.value;
    }
  }

  function generateUniqueKeyForPoll (){
    return Math.random().toString(16).slice(2)
  }

  function countVotes (votes) {
    for (var key in votes) {
      votesTally[key] = _.countBy(votes[key], function(value, key){
        return value
      })
    }
  }

  function fiterVotesByMessageKey(message) {
    for (var key in votesTally) {
      if (key === message.key) {
         io.sockets.emit('voteCount', votesTally[key]);
      }
    }
  }
});




module.exports = server;