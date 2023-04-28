$(document).ready(function() {
  // traverse to get the compose tweet char counter number from the original DOM data, which is the original character limit
  const origCounterValue = Number($('#tweet-text').parent().find('.counter').html());
  
  $('#tweet-text').on('input', function() {    
    // get counter num and set it
    const textareaLen = $(this).val().length;
    const $counter = $(this).parent().find('.counter');
    const totalCharsLeft = origCounterValue - textareaLen;
    $counter.html(totalCharsLeft);

    // make counter red if exceeded char count
    if(totalCharsLeft < 0) {
      $counter.css("color", "red");
    }
    else {
      // remove style
      $counter.css("color", '');
    }
  });
});