module.exports = {
  generateUniqueKeyForPoll: function() {
    return Math.random().toString(16).slice(2);
  },
};