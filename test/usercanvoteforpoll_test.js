const Browser = require('zombie');

Browser.localhost('https://realtimeanytime.herokuapp.com/', 3000);

describe('User can vote for poll', function() {
  const browser = new Browser({
    site: 'http://localhost:3000'
  });

  before(function() {
   return browser.visit('/');
  });

  before(function(){
    browser
      .fill('items', 'ABC');
      return browser.pressButton('CLICK HERE TO GENERATE POLL');
  });

  before(function(){
    var key = browser.url.split('/').slice(-1).pop();
    return browser.visit('/polls/' + key);
    return browser.pressButton('ABC');
    return browser.visit('/polls/' + key);
  });

  it('should say thank you for voting', function() {
    browser.assert.text('h3', 'Thank you for voting!');
  });

  it('should still have buttons albeit hidden', function () {
    browser.assert.className('button','btn btn-info');
  });

  after(function() {
    browser.destroy();
  });
});