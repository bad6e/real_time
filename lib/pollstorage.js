const _ = require('lodash');

function PollStorage() {
  this.pollList = {};
}

PollStorage.prototype.addPollToList = function(message, key) {
  return this.pollList[key] = message
},

PollStorage.prototype.checkIfPollClosed = function(id, res) {
  if (this.pollList[id] === null){
    res.render('pollclosed');
  } else {
    this.checkIfPollTimeIsOver(id, res);
  }
},

PollStorage.prototype.checkIfPollTimeIsOver = function(id, res) {
  if (this.pollList[id].endtime === undefined || this.pollList[id].endtime !== this.getTimeInCorrectForm()) {
    this.checkIfPollIsShared(id, res);
  } else if (this.getTimeInCorrectForm() === this.pollList[id].endtime) {
    this.endPoll(id);
    res.render('pollclosed');
  }
},

PollStorage.prototype.checkIfPollIsShared = function(id, res) {
  var data = this.obtainPollItems(id);
  if (this.pollList[id].share === undefined) {
    res.render('polls', {data, id} );
  } else {
    var status = this.obtainPollStatus(id);
    res.render('polls', {data, id, status} );
  }
},

PollStorage.prototype.endPoll = function(message) {
  this.pollList[message] = null;
},

PollStorage.prototype.obtainPollItems = function(id) {
  return this.pollList[id].items;
},

PollStorage.prototype.obtainPollStatus = function(id) {
  return this.pollList[id].share;
},

PollStorage.prototype.getTimeInCorrectForm = function() {
  var time = new Date();
  return time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })
}

module.exports = PollStorage;