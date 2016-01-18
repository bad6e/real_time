$(document).ready(function() {
  bindClick();
});

function bindClick () {
  $('.additional-choice:last').on('click', function (e) {
  addAdditionalPollItem();
  });
}

function addAdditionalPollItem() {
  var additionalChoice = '<br><input class="choice form-control" type="text" name="items" placeholder="Next Poll Item"><button class="additional-choice btn btn-success" type="button" name="button">Click Here Only if You Want to Add Another Poll Item</button>';
  $('.additional-choice').hide();
  $('.additional-choice:last').append().after(additionalChoice);
  bindClick();
}
