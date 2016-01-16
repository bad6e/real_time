'use strict';
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
const PollStorage = require('../lib/pollstorage');

describe('PollStorage', function () {

  beforeEach(function() {
    this.pollStorage = new PollStorage();
  });

  it('has a polls attribute that starts as an empty object', function () {
    expect(this.pollStorage.polls).eql({});
  });

  // it('creates a poll and finds it by its admin_id', function (done) {
  //   var pollParams = { name: 'test poll',
  //     questions: {
  //       question1: 'question1'
  //     }
  //   }
  //   var poll = dataStore.createPoll(pollParams);
  //   expect(dataStore.findPollByAdminId(poll.admin_id)).eql(poll);
  //   done();
  // });

  // it('can find saved polls by the poll_id', function (done) {
  //   var pollParams = { name: 'test poll',
  //     questions: {
  //       question1: 'question1'
  //     }
  //   }
  //   var poll = new Poll(pollParams);
  //   dataStore.polls[poll.admin_id] = poll;
  //   expect(dataStore.findPollByPollId(poll.poll_id)).eql(poll);
  //   done();
  // });
})