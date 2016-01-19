module.exports = {
  'Step One - User can create poll and share results with pollees' : function (browser) {
    browser
      .url('http://localhost:3000/')
      .waitForElementVisible('body', 1000)
      .setValue('input[name="items"]', 'ABC')
      .click('input[name="share"]')
      .click('input[type=submit]')
      .waitForElementVisible('body', 1000)
      .assert.containsText('h1', 'Here are the vote counts:')
      .click('a[class="poll-link"]')
      .assert.containsText('button', 'ABC')
      .click('button')
      .waitForElementVisible('body', 1000)
      .assert.containsText('.thank-you', 'Thank you for voting!')
      .assert.containsText('.vote-count', 'Poll Item: undefined has 1 vote(s).')
      .waitForElementVisible('body', 1000)
      .end();
  }
};