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
    } else if(channel === 'generate poll'){
      var uniqueKey = Math.random().toString(16).slice(2)
      polls[uniqueKey] = message;
      socket.emit('generate poll', uniqueKey);
    } else if(channel === 'voteCast') {

      // message.id = socket.id
      // socket.id
      var specificUser = {};

      console.log(socket.id)
      specificUser[socket.id] = message.value;
      // specificUser.value = message.value;
      if (votes[message.key] === undefined){
        votes[message.key] = [specificUser]
      } else {
        votes[message.key].push(specificUser);
      }
      // votes[message.key] = specificUser

      // votes[socket.id] = message;
      //DOES THE MESSAGE.KEY MATCH the VOTE KEY - IF YES - COUNT THE DAY AND SEND THEM UP

      console.log(votes)
      console.log(votes[message.key])
      // console.log(countVotes(votes[message.key]))
      // votes[message.key]


       io.sockets.emit('voteCount', votes);

      // for (var key in votes) {
      //   eval(pry.it)
      //   if (key === message.key) {

      //   }
      // }

    }
  });

  function countVotes (votes) {
    return _.countBy(votes, function(value, key){
      return value
    })
  }

  // socket.on('disconnect', function(){
  //   console.log("A user has disconnected.", io.engine.clientsCount)
  //   delete polls[socket.id];
  // });
});



module.exports = server;