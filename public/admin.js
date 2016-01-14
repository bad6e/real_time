var socket = io();

socket.on('voteCount', function(message) {
  console.log(message)
  $('.vote-count').empty();
  for (var key in message){
    $('.vote-count').append("Poll Item: " + key + " has " + message[key] +  " vote(s).<br>");
}

// for (var k in target){
//     if (target.hasOwnProperty(k)) {
//          alert("Key is " + k + ", value is" + target[k]);
//     }
// }

  // debugger
  // .forOwn(message, function(value, key) {
  //   debugger
  //   $('.vote-count').append(`${key}`);
  // } );
//   for (var key in message) {
//     debugger

//   // console.log(key);
// }
  // console.log(message)
});