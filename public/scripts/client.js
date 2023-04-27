/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // code from https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time
  // in miliseconds
  const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: 24 * 60 * 60 * 1000 * 365 / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
  };

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const getRelativeTime = (d1, d2 = new Date()) => {
    const elapsed = d1 - d2;

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const u in units)
      if (Math.abs(elapsed) > units[u] || u == 'second')
        return rtf.format(Math.round(elapsed / units[u]), u);
  };

  const createTweetElement = function(tweet) {

    // Implementing jQuery HTML data to avoid XSS

    const $tweetElement = $('<article>');
    $tweetElement.addClass('tweet-container');

    // handle header data
    const $tweetHeader = $('<header>');
    const $authorNameAndAvatarDiv = $('<div>');
    $authorNameAndAvatarDiv.addClass('author-name-and-avatar');
    const $authorAvatarDiv = $('<div>');
    $authorAvatarDiv.addClass('author-avatar');
    const $img = $('<img>');
    $img.attr('src', tweet.user.avatars);
    $authorAvatarDiv.append($img);
    $authorNameAndAvatarDiv.append($authorAvatarDiv);
    const $authorNameDiv = $('<div>');
    $authorNameDiv.addClass('author-name');
    $authorNameDiv.text(tweet.user.name);
    $authorNameAndAvatarDiv.append($authorNameDiv);
    $tweetHeader.append($authorNameAndAvatarDiv);
    const $authorHandleDiv = $('<div>');
    $authorHandleDiv.addClass('author-handle');
    $authorHandleDiv.text(tweet.user.handle);
    $tweetHeader.append($authorHandleDiv);

    $tweetElement.append($tweetHeader);

    // handle p data
    const $p = $('<p>');
    $p.text(tweet.content.text);

    $tweetElement.append($p);

    // handle footer data
    // probably won't be able to inject anything here, so will just code it in
    $tweetElement.append($(`<footer>
    <div class="timestamp">${getRelativeTime(1461116232227)}</div>
    <div class="tweet-actions">
      <i class="fa-regular fa-flag"></i>
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-regular fa-heart"></i>
    </div>
  </footer>`));

    // $tweetElement.children('header').append($('<div>'));
    // $tweetElement.append($('<p>'));
    // $tweetElement.append($('<footer>'));
    console.log('tweetElement.html():', $tweetElement.html());
    return $tweetElement;
  };

  const renderTweets = function(tweetsArr) {
    const $tweetsContainer = $('#tweets-container');
    $tweetsContainer.empty();
    for (const tweet of tweetsArr) {
      const $tweet = createTweetElement(tweet);
      $tweetsContainer.prepend($tweet);
    }
  };


  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
    }).then(function(tweets) {
      renderTweets(tweets);
    });
  };
  const origCounterValue = Number($('#tweet-text').parent().find('.counter').html());

  const $newTweetForm = $('.new-tweet').children('form');

  const validateForm = function(event) {
    event.preventDefault();

    // validate form before confirming submission
    const textareaLen = $newTweetForm.children('textarea').val().length;

    const totalCharsLeft = origCounterValue - textareaLen;

    // remove any existing errors
    const $errorMsg = $newTweetForm.parent().find('div.error');
    $errorMsg.slideUp("slow", function() {
      // do validation
      if (totalCharsLeft === origCounterValue) {
        // error message
        $errorMsg.html(`<i class="fa-solid fa-triangle-exclamation"></i>No message found, please write something<i class="fa-solid fa-triangle-exclamation"></i>`);
        // $newTweetForm.parent().children().eq(0).after(`<div class="error"></div>`);
        $errorMsg.slideDown("slow");
        return;
      }

      if (totalCharsLeft < 0) {
        // error message
        $errorMsg.html(`<i class="fa-solid fa-triangle-exclamation"></i>Your tweet is too long! Don't forget about that ${origCounterValue} character limit! ...sorry...<i class="fa-solid fa-triangle-exclamation"></i>`);
        $errorMsg.slideDown("slow");
        return;
      }
    });

    // do the tweet creation not after the slideUp function, but simultaneously, which means handling the booleans again
    if(!(totalCharsLeft === origCounterValue || totalCharsLeft < 0)) {
      console.log("$errorMsg:", $errorMsg);


      // happy path
      const dataQueryString = $newTweetForm.serialize();
      console.log('dataQueryString:', dataQueryString);

      // clear form
      $('#tweet-text').val('');

      $.ajax({
        method: 'POST',
        url: '/tweets/',
        data: dataQueryString
      }).then(function(/* responseData */) {
        loadTweets();
        console.log('request has resolved');
      });
    }
  };
  
  loadTweets();
  $newTweetForm.on('submit', validateForm);
});