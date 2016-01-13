var socket = io();
var pollItems = [];

//Submitting Poll Items
$('.submit-poll-item').on('click', function (e) {
  e.preventDefault();
  var pollItem = $('.new-poll-items .poll-item').val();
  groupedPollItems(pollItem)
  socket.send('poll item', {
    item: pollItem
  });
});

//Saving all Poll Items into an array
function groupedPollItems(pollItem) {
  pollItems.push(pollItem);
}

//Append the new Poll Item to the screen
socket.on('poll item', function(message) {
  $('.all-poll-items').append(`Poll Item: ${message.item}<br>`);
});

socket.on('generate poll', function(message) {
  $('.generated-poll').append(`<li>${message}</li>`);
});

//Requesting finish Poll
$('.generate-poll').on('click', function (e) {
  e.preventDefault();
  socket.send('generate poll', pollItems)
});


