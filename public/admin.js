var socket = io();
var divKey = window.location.pathname.split('/').slice(-1).pop();

$(document).ready(function() {
  displayLink(divKey);
  endPoll();
})

socket.on('voteCount-' + divKey, function(message) {
  hideNofiticiations();
  displayVotes(message);
});

function hideNofiticiations() {
  $('h4').hide();
  $('.vote-count').empty();
}

function displayVotes(message) {
  for (var key in message){
    $('.vote-count').append("Poll Item: "
                            + key
                            + " has "
                            + message[key]
                            +  " vote(s).<br>");
  }
}

function displayLink(divKey) {
  $('p').html("<p> Poll Link: http://localhost:3000/polls/" + divKey);
}

function endPoll() {
  $('.end-poll').on('click', function() {
    socket.send('endPoll-' + divKey, divKey);
  });
}

