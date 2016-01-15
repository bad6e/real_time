var socket = io();
var divKey = $('h1').attr('class')
var choices = []

socket.on('voteCount', function(message) {
  console.log(message)
  hideNofiticiations();
  displayVotes(message)
});

function hideNofiticiations () {
  $('p').hide();
  $('.vote-count').empty();
}

function displayVotes (message) {
  for (var key in message){
    debugger
    $('.vote-count').append("Poll Item: "
                            + key
                            + " has "
                            + message[key]
                            +  " vote(s).<br>");

  }
}