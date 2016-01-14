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

app.get('/polls/:id', function(req , res){
  console.log(req.params.id)
  var id = req.params.id

  var foundId = _.find(Object.keys(polls) , function(d) {
    return d === req.params.id
  });

  if (!foundId) {
    console.log('bad id');
    res.status(404).end();
  } else {
    var data = pollData(id).items;


    // res.send(data);
    res.render('polls', {data} );
  }
});

app.get('/polls/admin/:id', function(req , res){
  console.log(req.params.id)
  var id = req.params.id

  var foundId = _.find(Object.keys(polls) , function(d) {
    return d === req.params.id
  });

  if (!foundId) {
    console.log('bad id');
    res.status(404).end();
  } else {
    var data = pollData(id);
    res.render(data);
  }
});

function pollData (id) {
  return polls[id]
}

io.on('connection', function(socket){
  console.log("A user has connected", io.engine.clientsCount)

  socket.on('message', function (channel, message) {
    if (channel === 'poll item') {
      socket.emit('poll item', message);
    } else if(channel === 'generate poll'){
      var uniqueKey = Math.random().toString(16).slice(2)
      polls[uniqueKey] = message;
      console.log(polls)
      socket.emit('generate poll', uniqueKey);
    } else if(channel === 'voteCast') {
      votes[socket.id] = message;
      console.log(votes)
      // socket.emit('voteCount', countVotes(votes));
    }
  });

  socket.on('disconnect', function(){
    console.log("A user has disconnected.", io.engine.clientsCount)
    delete polls[socket.id];
  });

});


function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };

  for (vote in votes) {
    voteCount[votes[vote]]++
  }
  return voteCount;
}

module.exports = server;