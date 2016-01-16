const _ = require('lodash');

function PollStorage() {
  this.polls = {};
}

PollStorage.prototype.createPoll = function(message, key) {
  return this.polls[key] = message
},

PollStorage.prototype.voteSorter = function (message, votes, votesTally, socketId) {
  var votes = this.assignVotesToSpecificPoll(message, votes, socketId);
  this.countVotes(votes, votesTally);
  return this.fiterVotesByMessageKey(message, votesTally);
},

PollStorage.prototype.assignVotesToSpecificPoll = function(message, votes, socketId) {
  if (votes[message.key] === undefined){
    var specificUsersVote = {};
    specificUsersVote[socketId] = message.value;
    votes[message.key] = specificUsersVote;
  } else {
    votes[message.key][socketId] = message.value;
  }
  return votes
},

PollStorage.prototype.countVotes = function(votes, votesTally) {
  for (var key in votes) {
    votesTally[key] = _.countBy(votes[key], function(value, key) {
      return value
    })
  }
},

PollStorage.prototype.fiterVotesByMessageKey = function(message, votesTally) {
  for (var key in votesTally) {
    if (key === message.key) {
      return votesTally[key]
    }
  }
}

module.exports = PollStorage



