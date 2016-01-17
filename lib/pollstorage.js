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
},

PollStorage.prototype.endPoll = function(message) {
  this.polls[message] = null;
},

PollStorage.prototype.checkIfPollClosed = function(id, res) {
  if (this.polls[id] === null){
    res.render('pollclosed');
  } else {
    this.checkIfPollIsShared(id, res);
  }
},

PollStorage.prototype.checkIfPollIsShared = function(id, res){
  var data = this.obtainPollItems(id);
  if (this.polls[id].share === undefined) {
    res.render('polls', {data, id} );
  } else {
    var status = this.obtainPollStatus(id);
    res.render('polls', {data, id, status} );
  }
},

PollStorage.prototype.obtainPollItems = function(id) {
  return this.polls[id].items;
},

PollStorage.prototype.obtainPollStatus = function(id) {
  return this.polls[id].share;
}

module.exports = PollStorage
