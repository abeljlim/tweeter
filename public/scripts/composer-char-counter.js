$(document).ready(function() {
  // --- our code goes here ---

  // traverse to get the compose tweet char counter number, which is original character limit
  const origCounterValue = Number($('#tweet-text').parent().find('.counter').html());
  

  console.log('$(document).ready');
  $('#tweet-text').on('input', function() {
    if(origCounterValue === -1) {
      
    }
    
    const textareaLen = $(this).val().length;
    const $counter = $(this).parent().find('.counter');
    const totalCharsLeft = origCounterValue - textareaLen;
    $counter.html(totalCharsLeft);
    if(totalCharsLeft < 0) {
      $counter.css("color", "red");
    }
    else {
      // remove style
      $counter.css("color", '');
    }
  });
});