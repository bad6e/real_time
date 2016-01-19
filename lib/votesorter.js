const _ = require('lodash');

function VoteSorter () {
  this.votes = {};
  this.votesTally = {};
}

VoteSorter.prototype.sortVotesByPoll = function (message, votes, votesTally, socketId) {
  var assignedVotes = this.checkIfVotesHaveBeenAssignedToPoll(message, votes, socketId);
  this.countVotes(assignedVotes, votesTally);
  return this.fiterVotesByMessageKey(message, votesTally);
},

VoteSorter.prototype.checkIfVotesHaveBeenAssignedToPoll = function(message, votes, socketId) {
  if (votes[message.key] === undefined){
    this.assignVotesToPoll(message, votes, socketId);
  } else {
    this.addVotesToExistingPoll(message, votes, socketId);
  }
  return votes
},

VoteSorter.prototype.assignVotesToPoll = function(message, votes, socketId){
  var specificUsersVote = {};
  specificUsersVote[socketId] = message.value;
  votes[message.key] = specificUsersVote;
},

VoteSorter.prototype.addVotesToExistingPoll = function(message, votes, socketId) {
  votes[message.key][socketId] = message.value;
},

VoteSorter.prototype.countVotes = function(assignedVotes, votesTally) {
  for (var key in assignedVotes) {
    votesTally[key] = _.countBy(assignedVotes[key], function(value, key) {
      return value
    })
  }
},

VoteSorter.prototype.fiterVotesByMessageKey = function(message, votesTally) {
  for (var key in votesTally) {
    if (key === message.key) {
      return votesTally[key]
    }
  }
}

module.exports = VoteSorter;