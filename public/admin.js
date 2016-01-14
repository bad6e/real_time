var socket = io();

socket.on('voteCount', function(message) {
  $('.vote-count').empty();
  hideNofiticiation();
  displayVotes(message);
});

function hideNofiticiation () {
  $('p').hide();
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