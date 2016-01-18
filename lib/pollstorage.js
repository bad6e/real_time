const _ = require('lodash');

function PollStorage() {
  this.polls = {};
}

PollStorage.prototype.createPoll = function(message, key) {
  return this.polls[key] = message
},

PollStorage.prototype.voteSorter = function (message, votes, votesTally, socketId) {
  var votes = this.checkIfVotesHaveBeenAssignedToPoll(message, votes, socketId);
  this.countVotes(votes, votesTally);
  return this.fiterVotesByMessageKey(message, votesTally);
},

PollStorage.prototype.checkIfVotesHaveBeenAssignedToPoll = function(message, votes, socketId) {
  if (votes[message.key] === undefined){
    this.assignVotesToPoll(message, votes, socketId);
  } else {
    this.addVotesToExistingPoll(message, votes, socketId);
  }
  return votes
},

PollStorage.prototype.assignVotesToPoll = function(message, votes, socketId){
  var specificUsersVote = {};
  specificUsersVote[socketId] = message.value;
  votes[message.key] = specificUsersVote;
},

PollStorage.prototype.addVotesToExistingPoll = function(message, votes, socketId) {
  votes[message.key][socketId] = message.value;
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

PollStorage.prototype.checkIfPollClosed = function(id, res) {
  if (this.polls[id] === null){
    res.render('pollclosed');
  } else {
    this.checkIfPollTimeIsOver(id, res);
  }
},

PollStorage.prototype.checkIfPollTimeIsOver = function(id, res) {
  if (this.polls[id].endtime === undefined || this.polls[id].endtime !== this.getTimeInCorrectForm()) {
    this.checkIfPollIsShared(id, res);
  } else if (this.getTimeInCorrectForm() === this.polls[id].endtime) {
    this.endPoll(id);
    res.render('pollclosed');
  }
},

PollStorage.prototype.checkIfPollIsShared = function(id, res) {
  var data = this.obtainPollItems(id);
  if (this.polls[id].share === undefined) {
    res.render('polls', {data, id} );
  } else {
    var status = this.obtainPollStatus(id);
    res.render('polls', {data, id, status} );
  }
},

PollStorage.prototype.endPoll = function(message) {
  this.polls[message] = null;
},

PollStorage.prototype.obtainPollItems = function(id) {
  return this.polls[id].items;
},

PollStorage.prototype.obtainPollStatus = function(id) {
  return this.polls[id].share;
},

PollStorage.prototype.getTimeInCorrectForm = function() {
  var time = new Date();
  return time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })
}

module.exports = PollStorage