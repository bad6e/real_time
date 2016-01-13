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

//Append the Poll and Admin Links to the Page
socket.on('generate poll', function(message) {
  var url = Object.keys(message)
  //The url key part wil key of the polls sent from the server
  $('.generated-poll').append(`<li>Poll Link: localhost:3000/polls/${url}</li>
                               <li>Poll Link: www.imconfused.com</li>`);
});

//Requesting finish Poll
$('.generate-poll').on('click', function (e) {
  e.preventDefault();
  socket.send('generate poll', pollItems)
});


