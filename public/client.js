var socket = io();

socket.on('poll item', function(message) {
  $('.all-poll-items').append(`<li>${message.item}</li>`);
});

$('.submit-poll-item').on('click', function (e) {
  e.preventDefault();

  var pollItem = $('.new-poll-items .poll-item').val();

  socket.send('poll item', {
    item: pollItem
  });
});


