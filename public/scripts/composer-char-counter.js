$(document).ready(function() {
  // traverse from element with id #tweet-text to get the char counter number from the original DOM data, which is the original character limit
  const origCounterValue = Number($('#tweet-text').parent().find('.counter').html());

  const $textarea = $('#tweet-text');

  const updateCounter = function() {
    // get counter num and set it
    const textareaLen = $textarea.val().length;
    const $counter = $textarea.parent().find('.counter');
    const totalCharsLeft = origCounterValue - textareaLen;
    $counter.html(totalCharsLeft);

    // make counter red if exceeded char count
    if (totalCharsLeft < 0) {
      $counter.css("color", "red");
    } else {
      // remove style
      $counter.css("color", '');
    }
  };

  $textarea.on('input', updateCounter);
  const $newTweetForm = $textarea.parent();
  $newTweetForm.on('submit', updateCounter);
});