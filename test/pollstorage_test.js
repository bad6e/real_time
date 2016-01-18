'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const PollStorage = require('../lib/pollstorage');

describe('PollStorage', function () {

  beforeEach(function() {
    this.pollStorage = new PollStorage();
    this.message = { items: [ 'A', 'B' ] };
    this.voteMessage = { key: 'cd1917c7', value: 'A' };
    this.socketId = 'Qdna#ds';
  });

  it('has a polls attribute that starts as an empty object', function () {
    expect(this.pollStorage.polls).eql({});
  });

  it('creates a poll with a poll key as the key and the poll items as the value', function (){
    var key = "abc123";
    var newPoll = this.pollStorage.createPoll(this.message, key);
    expect(this.pollStorage.polls).eql({abc123: { items: [ 'A', 'B' ] } });
  });

  it('assigns votes to a specific poll', function (){
    var votes = {};
    var assignedPoll = this.pollStorage.assignVotesToSpecificPoll(this.voteMessage, votes, this.socketId );
    expect(assignedPoll).eql({ cd1917c7: { 'Qdna#ds': 'A' } });
    expect(votes).eql({ cd1917c7: { 'Qdna#ds': 'A' } });
  });

  it('counts the votes of a each poll', function (){
    var votesTally = {};
    var votes = { cd1917c7: { 'Qdna#ds': 'A' } };
    var countedPoll = this.pollStorage.countVotes(votes, votesTally);
    expect(votesTally).eql({ cd1917c7: { A: 1 } });
  });

  it('counts the votes of a each poll when there are multiple unique polls and multiple votes', function (){
    var votesTally = {};
    var votes = { cd1917c7: { 'Qdna#ds': 'A' },
                  rd191dc7: { 'Adna#df': 'B', 'Sdna#df': 'B' } };
    var countedPoll = this.pollStorage.countVotes(votes, votesTally);
    expect(votesTally).eql({ cd1917c7: { A: 1 },
                             rd191dc7: { B: 2 }});
  });

  it('filters the votes by the message key when there is multiple polls', function (){
    var votesTally = { 'cd1917c7': { A: 2 }, '237cc8f': { C: 1 } };
    var filteredPoll = this.pollStorage.fiterVotesByMessageKey(this.voteMessage, votesTally);
    expect(filteredPoll).eql({ A: 2 });
  });

  it('ends a specific poll based on a key', function (){
    var votesTally = {};
    var votes = { cd1917c7: { 'Qdna#ds': 'A' },
                  rd191dc7: { 'Adna#df': 'B', 'Sdna#df': 'B' } };
    var countedPoll = this.pollStorage.countVotes(votes, votesTally);
    var endedPoll = this.pollStorage.endPoll(this.voteMessage.key);
    expect(this.pollStorage.polls).eql({ cd1917c7: null });
  });

  it("it obtains a polls items", function (){
    var key = "abc123";
    var newPoll = this.pollStorage.createPoll(this.message, key);
    var pollItems = this.pollStorage.obtainPollItems('abc123');
    expect(pollItems).eql([ 'A', 'B' ])
  });

  it("it obtains a polls status if status is true", function (){
    var key = "abc123";
    var newPoll = this.pollStorage.createPoll({ items: [ 'A', 'C' ], share: 'true' }, key);
    var pollStatus = this.pollStorage.obtainPollStatus('abc123');
    expect(pollStatus).eql('true')
  });

  it("get the time in the correct format as a string", function (){
    var pollTime = this.pollStorage.getTimeInCorrectForm();
    assert.isString(pollTime, 'must be a string');
  });
});