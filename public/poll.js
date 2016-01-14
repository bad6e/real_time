var socket = io();


var buttons = document.querySelectorAll('#choices button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function(){
    socket.send('voteCast', this.innerText);
  });
};