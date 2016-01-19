const VoteSorter = require('../lib/votesorter');
const sinon = require('sinon');

describe('Vote Sorting Functions', function () {

  beforeEach(function() {
    this.voteSorter = new VoteSorter();
    this.voteMessage = { key: 'cd1917c7', value: 'A' };
    this.socketId = 'Qdna#ds';
    this.response = {
      render: function() {
      }
    }
  });

  it('checks if a vote has been assigned to a specific poll - if no then call the function to assign it', function () {
    var votes = {};
    var theSpy = sinon.spy(this.voteSorter, "assignVotesToPoll");
    var checkingPoll = this.voteSorter.checkIfVotesHaveBeenAssignedToPoll(this.voteMessage, votes, this.socketId);
    sinon.assert.calledOnce(theSpy);
    theSpy.restore();
  });

  it('checks if a vote has been assigned to a specific poll - if yes then call the function add votes to existing polls', function () {
    var votes = { cd1917c7: { 'Zdna#ds': 'A' } };
    var theSpy = sinon.spy(this.voteSorter, "addVotesToExistingPoll");
    var checkingPoll = this.voteSorter.checkIfVotesHaveBeenAssignedToPoll(this.voteMessage, votes, this.socketId);
    sinon.assert.calledOnce(theSpy);
    theSpy.restore();
  });

  it('assigns votes to a specific poll if the poll if the poll has not been assigned', function () {
    var votes = {};
    var assignedPoll = this.voteSorter.assignVotesToPoll(this.voteMessage, votes, this.socketId );
    expect(votes).eql({ cd1917c7: { 'Qdna#ds': 'A' } });
  });

  it('added votes to a poll if the poll has already been assigned', function () {
    var votes = { cd1917c7: { 'Xdna#ds': 'A' } };
    var assignedPoll = this.voteSorter.addVotesToExistingPoll(this.voteMessage, votes, this.socketId );
    expect(votes).eql({ cd1917c7: { 'Xdna#ds': 'A', 'Qdna#ds': 'A' } });
  });

  it('counts the votes of a each poll', function (){
    var votesTally = {};
    var votes = { cd1917c7: { 'Qdna#ds': 'A' } };
    var countedPoll = this.voteSorter.countVotes(votes, votesTally);
    expect(votesTally).eql({ cd1917c7: { A: 1 } });
  });

  it('counts the votes of a each poll when there are multiple unique polls and multiple votes', function () {
    var votesTally = {};
    var votes = { cd1917c7: { 'Qdna#ds': 'A' },
                  rd191dc7: { 'Adna#df': 'B', 'Sdna#df': 'B' } };
    var countedPoll = this.voteSorter.countVotes(votes, votesTally);
    expect(votesTally).eql({ cd1917c7: { A: 1 },
                             rd191dc7: { B: 2 }});
  });

  it('filters the votes by the poll key when there are multiple polls with multiple votes', function () {
    var votesTally = { 'cd1917c7': { A: 2 }, '237cc8f': { C: 1 } };
    var filteredPoll = this.voteSorter.fiterVotesByMessageKey(this.voteMessage, votesTally);
    expect(filteredPoll).eql({ A: 2 });
  });

  it('checks if votes has been cast and renders the admin page', function() {
    var votesTally = {};
    var votes = { cd1917c7: { 'Qdna#ds': 'A' },
                  rd191dc7: { 'Adna#df': 'B', 'Sdna#df': 'B' } };
    var id = 'rd191dc7'
    var responseSpy = sinon.spy(this.response, "render");
    var voteChecker = this.voteSorter.checkIfVotesExistAndRender(this.response, id)
    sinon.assert.calledOnce(responseSpy);
    responseSpy.restore();
  });
});