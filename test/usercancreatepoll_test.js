const Browser = require('zombie');

Browser.localhost('https://realtimeanytime.herokuapp.com/', 3000);

describe('home page', function() {

  const browser = new Browser({
    site: 'http://localhost:3000'
  });

  before(function() {
   return browser.visit('/');
  });

  it('should be successful', function() {
    browser.assert.success();
    browser.assert.status(200);
  });

  it('should see a welcome title', function() {
      browser.assert.text('h2', 'Welcome to the Poll Generator');
  });

  it('should have a form to submit poll items', function() {
    browser.assert.elements('form input[name=items]', 2);
  });

  it('should have a form to submit the time', function() {
    browser.assert.elements('form input[name=endtime]', 1);
  });

  it('should have a checkbox to share the results', function() {
    browser.assert.elements('form input[name=share]', 1);
  });

  it('should have a button to add new poll items', function() {
    browser.assert.elements('button', 1);
  });
});

describe('generate poll', function() {

  const browser = new Browser({
    site: 'http://localhost:3000'
  });

  before(function() {
   return browser.visit('/');
  });

  it('should be successful', function() {
    browser.assert.success();
    browser.assert.status(200);
  });

  before(function(){
    browser
      .fill('items', 'ABC');
      return browser.pressButton('CLICK HERE TO GENERATE POLL');
      browser.assert.success();
  });

  it('should be redirected to the admin page', function() {
    browser.assert.status(200);
  });

  it('should see a vote count title', function() {
      browser.assert.text('h1', 'Here are the vote counts:');
  });

  it('should have an end poll button', function() {
    browser.assert.elements('button', 1);
  });

  it('should see a link title', function() {
      browser.assert.text('h3', 'Poll Link');
  });

  it('should have a poll link on the admin page', function () {
    browser.assert.className('a','poll-link');
  });
});

