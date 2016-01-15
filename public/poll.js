var socket = io();

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