'use strict';
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
const PollStorage = require('../lib/pollstorage');

describe('PollStorage', function () {

  beforeEach(function() {
    this.pollStorage = new PollStorage();
    this.message = { items: [ 'A' ] }
    this.voteMessage = { key: 'cd1917c7', value: 'A' }
    this.socketId = 'Qdna#ds'
  });

  it('has a polls attribute that starts as an empty object', function () {
    expect(this.pollStorage.polls).eql({});
  });

  it('creates a poll with a poll key as the key and the poll items as the value', function (){
    var key = "abc123"
    var newPoll = this.pollStorage.createPoll(this.message, key)
    expect(this.pollStorage.polls).eql({abc123: { items: [ 'A' ] } })
  });

  it('assigns votes to a specific poll', function (){
    var votes = {}
    var assignedPoll = this.pollStorage.assignVotesToSpecificPoll(this.voteMessage, votes, this.socketId )
    expect(assignedPoll).eql({ cd1917c7: { 'Qdna#ds': 'A' } })
  });

  it('counts the votes of a each poll', function (){

  });

  it('filters the votes by the message key', function (){

  });
})