var socket = io();
var divKey = window.location.pathname.split('/').slice(-1).pop();

var pollLinkWithRoot = $(location).attr('origin') + "/polls/" + divKey

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
  $('p').html("<p><a class='poll-link' href='" + pollLinkWithRoot
                + "'>https://realtimeanytime.herokuapp.com/polls/"
                + divKey
                + "</a></p>");

}

function endPoll() {
  $('.end-poll').on('click', function() {
    socket.send('endPoll-' + divKey, divKey);
    $('.end-poll').hide();
    $('h2').show();
  });
}