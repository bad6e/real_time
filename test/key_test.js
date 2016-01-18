const _ = require('lodash');
const key = require('../lib/key');

describe('Key', function () {
  it('generates at least a 6 diget key', function () {
    var uniqueKey = key.generateUniqueKeyForPoll();
    expect(uniqueKey.length).to.be.above(5)
  });

  it('generates a unique key', function () {
    var keyGroup = []
    var i = 0
    for (i = 0; i < 100; i++) {
      var specialKey = key.generateUniqueKeyForPoll();
      keyGroup.push(specialKey);
    };
    expect(_.uniq(keyGroup).length).to.be.above(80)
  });
});