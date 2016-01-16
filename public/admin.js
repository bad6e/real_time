var socket = io();
var divKey = $('h1').attr('class');
var pollId = window.location.pathname.split('/').slice(-1).pop();

$(document).ready(function() {
  displayLink(pollId);
})

socket.on('voteCount-' + divKey, function(message) {
  hideNofiticiations();
  displayVotes(message);
});

function hideNofiticiations() {
  $('h4').hide();
  $('.vote-count').empty();
}

function displayVotes (message) {
  for (var key in message){
    $('.vote-count').append("Poll Item: "
                            + key
                            + " has "
                            + message[key]
                            +  " vote(s).<br>");
  }
}

function displayLink (pollId) {
  $('p').html("<p> Poll Link: http://localhost:3000/polls/" + pollId)
}

