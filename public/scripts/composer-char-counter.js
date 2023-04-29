const { fn } = require("jquery");

{ // preventing global stuff

  $(document).ready(function() {
    // update counter whenever a char is inputted or the tweet button is pressed for submission
    $textarea.on('input', updateCounter);
    $textarea.parent().on('submit', updateCounter);
  });

  // traverse from element with id #tweet-text to get the char counter number from the original DOM data, which is the original character limit
  const origCounterValue = Number($('#tweet-text').parent().find('.counter').html());

  const $textarea = $('#tweet-text');

  const updateCounter = function() {
    // get counter num and set it
    const textareaLen = $textarea.val().length;
    const $counter = $textarea.parent().find('.counter'); // TODO: revise by using $textarea.closest(...).find('.counter')
    const totalCharsLeft = origCounterValue - textareaLen;
    $counter.html(totalCharsLeft);

    // make counter red if exceeded char count
    if (totalCharsLeft < 0) {
      $counter.css("color", "red"); // TODO: revise by using addClass and removeClass
    } else {
      // remove style
      $counter.css("color", '');
    }
  };
}

// IIFE (immediately invoked function expression)
(function(x) {

}) (jQuery);