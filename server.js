const http = require('http');
const express = require('express');
const app = express();
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
var activeLinks = {};

app.get('/polls/:id', function(req , res){
//req.params.id
});

var found = validIds.find(function (d) {return d.id === req.params.id;});
if(found is null) {
//
} else {
//it worked!
}

io.on('connection', function(socket){
  console.log("A user has connected", io.engine.clientsCount)

  socket.on('message', function (channel, message) {
    if (channel === 'poll item') {
      io.sockets.emit('poll item', message);
    } else if(channel === 'generate poll'){
      polls[Math.random().toString(16).slice(2)] = message;
      console.log(polls)
      io.sockets.emit('generate poll', polls);
    }
  });

  socket.on('disconnect', function(){
    console.log("A user has disconnected.", io.engine.clientsCount)
    delete polls[socket.id];
  });

});




















module.exports = server;