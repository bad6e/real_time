var socket = io();
var poll = {
  items: []
};

//Submitting Poll Items
$('.submit-poll-item').on('click', function (e) {
  e.preventDefault();
  var pollItem = $('.new-poll-items .poll-item').val();
  groupedPollItems(pollItem)
  socket.send('poll item', {
    item: pollItem
  });
});

// Saving all Poll Items into an array
function groupedPollItems(pollItem) {
  poll['items'].push(pollItem);
}

//Append the new Poll Item to the screen
socket.on('poll item', function(message) {
  $('.all-poll-items').append(`Poll Item: ${message.item}<br>`);
});


//Requesting finish Poll #1 - goes to 'generate poll'
$('.generate-poll').on('click', function (e) {
  e.preventDefault();
  socket.send('generate poll', poll)
});


//Append the Poll and Admin Links to the Page #2
socket.on('generate poll', function(message) {
  $('.generated-poll').append(`<li>Poll Link: localhost:3000/polls/${message}</li>
                               <li>Admin Link: localhost:3000/polls/admin/${message}`);
});
