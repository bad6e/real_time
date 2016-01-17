var socket = io();
var divKey = window.location.pathname.split('/').slice(-1).pop();
var status = $('h1').attr('class')

var buttons = document.querySelectorAll('#choices button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function(){

    var response = this.innerText
    var key = $(this).parents().first().attr('class')
    var responseObj = {};
    responseObj.key = key;
    responseObj.value = response;

    socket.send('voteCast', responseObj);
    $('#choices button').hide();
    $('.thank-you').show();
  });
};

socket.on('voteCount-' + divKey, function(message) {
    if (status === "true") {
      displayVotes(message)
    }
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

