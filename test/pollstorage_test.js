const PollStorage = require('../lib/pollstorage');
const sinon = require('sinon');

describe('PollStorage Functions', function () {

  beforeEach(function() {
    this.pollStorage = new PollStorage();
    this.message = { items: [ 'A', 'B' ] };
    this.response = {
      render: function() {
      }
    }
  });

  it('has a polls attribute that starts as an empty object', function () {
    expect(this.pollStorage.pollList).eql({});
  });

  it('creates a poll with a poll key as the key and the poll items as the value', function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList(this.message, key);
    expect(this.pollStorage.pollList).eql({abc123: { items: [ 'A', 'B' ] } });
  });

  it('checks if the poll is closed - if yes it renders a poll is closed page', function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList({ items: [ 'A', 'C' ], share: 'true' }, key);
    var endedPoll = this.pollStorage.endPoll(key);
    var theSpy = sinon.spy(this.response, "render")
    var checkingPoll = this.pollStorage.checkIfPollClosed(key, this.response);
    sinon.assert.calledOnce(theSpy);
    theSpy.restore();
  });

  it('checks if the poll is closed - if no it checks to see if the poll time has expired', function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList({ items: [ 'A', 'C' ], share: 'true' }, key);
    var theStub = sinon.stub(this.pollStorage, "checkIfPollTimeIsOver").returns('I have been called');
    var checkingPoll = this.pollStorage.checkIfPollClosed(key, this.response);
    sinon.assert.calledOnce(theStub);
    theStub.restore();
  });

  it('checks if the poll time has expired - if yes it ends the poll renders the poll page', function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList({ items: [ 'A', 'C' ], endtime: '14:35' }, key);
    var timeStub = sinon.stub(this.pollStorage, "getTimeInCorrectForm").returns('14:35');
    var endPollSpy = sinon.stub(this.pollStorage, "endPoll");
    var responseSpy = sinon.spy(this.response, "render");
    var endedPoll = this.pollStorage.checkIfPollTimeIsOver(key, this.response)
    sinon.assert.calledOnce(endPollSpy);
    sinon.assert.calledOnce(responseSpy);
    endPollSpy.restore();
    responseSpy.restore();
  });

  it('checks if the poll time has expired - if no it checks to see if the poll is shared', function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList({ items: [ 'A', 'C' ], endtime: '14:32' }, key);
    var timeStub = sinon.stub(this.pollStorage, "getTimeInCorrectForm").returns('14:35');
    var endPollSpy = sinon.spy(this.pollStorage, "endPoll");
    var responseSpy = sinon.spy(this.response, "render");
    var endedPoll = this.pollStorage.checkIfPollTimeIsOver(key, this.response);
    sinon.assert.notCalled(endPollSpy);
    sinon.assert.calledOnce(responseSpy);
    endPollSpy.restore();
    responseSpy.restore();
  });

  it("checks to see if the poll is shared - if yes it obtains a poll's status and renders the poll page with a true status", function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList({ items: [ 'A', 'C' ], share: 'true' }, key);
    var pollStatusSpy = sinon.spy(this.pollStorage, "obtainPollStatus");
    var responseSpy = sinon.spy(this.response, "render");
    var endedPoll = this.pollStorage.checkIfPollIsShared(key, this.response);
    sinon.assert.calledOnce(pollStatusSpy);
    sinon.assert.calledOnce(responseSpy);
    pollStatusSpy.restore();
    responseSpy.restore();
  });

  it('checks to see if the poll is shared - if no it renders the poll page', function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList({ items: [ 'A', 'C' ]}, key);
    var pollStatusSpy = sinon.spy(this.pollStorage, "obtainPollStatus");
    var responseSpy = sinon.spy(this.response, "render");
    var endedPoll = this.pollStorage.checkIfPollIsShared(key, this.response);
    sinon.assert.notCalled(pollStatusSpy);
    sinon.assert.calledOnce(responseSpy);
    pollStatusSpy.restore();
    responseSpy.restore();
  });

  it('ends a specific poll based on a poll key when there are multiple polls', function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList(this.message, key);
    var keyTwo = "cde456";
    var newPollTwo = this.pollStorage.addPollToList({ items: [ 'C', 'D' ] }, keyTwo);
    var endedPoll = this.pollStorage.endPoll(key);
    expect(this.pollStorage.pollList).eql({ abc123: null, cde456: { items: [ 'C', 'D' ] } });
  });

  it("it obtains a poll's items - the poll's questions", function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList(this.message, key);
    var pollItems = this.pollStorage.obtainPollItems('abc123');
    expect(pollItems).eql([ 'A', 'B' ]);
  });

  it("it obtains a poll's status if that status is true", function () {
    var key = "abc123";
    var newPoll = this.pollStorage.addPollToList({ items: [ 'A', 'C' ], share: 'true' }, key);
    var pollStatus = this.pollStorage.obtainPollStatus('abc123');
    expect(pollStatus).eql('true');
  });

  it("get the time in the correct format as a string", function () {
    var pollTime = this.pollStorage.getTimeInCorrectForm();
    assert.isString(pollTime, 'must be a string');
  });

  it("get the time in the correct format with a length of five - including : ", function () {
    var pollTime = this.pollStorage.getTimeInCorrectForm();
    expect(pollTime.length).eql(5);
  });
});
