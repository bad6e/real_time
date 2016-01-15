var socket = io();
var divKey = $('h1').attr('class')
var choices = []

socket.on('voteCount', function(message) {

  console.log(message[divKey])

  // for(var key in message){
  //   if(divKey === key){
  //     debugger
  //     choices.push(message[key].value)

  //     hideNofiticiations();
  //     console.log(choices)
  //     // displayVotes(choices);
  //   }
  // }

});

function hideNofiticiations () {

  $('p').hide();
}

function displayVotes (array) {
  // shit = []
  // shit.push(exactObject)
  // debugger
  // for (var key in message){

    // debugger
    //grab the object where the divKey matches
    //Then append all its shit
    // $('.vote-count').append("Poll Item: "
    //                         + exactObject.key
    //                         + " has "
    //                         + exactObject.value
    //                         +  " vote(s).<br>");
// $('.vote-count').empty();
// $('.vote-count').html(choices);
  // }
}