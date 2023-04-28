$(document).ready(function() {
  const createTweetElement = function(tweet) {

    // Implementing jQuery HTML data so as to avoid XSS attacks

    const $tweetElement = $('<article>');
    $tweetElement.addClass('tweet-container');

    // handle header data
    // (one element and attribute at a time, so as to avoid XSS injection from user-inputted data)
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
    // probably won't be able to inject anything here, so will just code it in directly
    $tweetElement.append($(`<footer>
    <div class="timestamp">${timeago.format(tweet.created_at)}</div>
    <div class="tweet-actions">
      <i class="fa-solid fa-flag"></i>
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-solid fa-heart"></i>
    </div>
  </footer>`));

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

  const $newTweetFormAnotherWay = $('#tweet-text').parent();
  const $newTweetForm = $('.new-tweet').children('form');
  console.log('$newTweetForm', $newTweetForm);
  console.log('$newTweetFormAnotherWay', $newTweetFormAnotherWay);
  console.log('$newTweetForm.is($newTweetFormAnotherWay)', ($newTweetForm.is($newTweetFormAnotherWay)));

  const validateFormAndAjax = function(event) {
    event.preventDefault();

    // validate form before confirming submission
    const textareaLen = $newTweetForm.children('textarea').val().length;

    const totalCharsLeft = origCounterValue - textareaLen;

    // remove any existing errors
    const $errorMsg = $newTweetForm.parent().find('div.error');
    $errorMsg.slideUp("slow", function() {
      // do validation

      const warningHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;

      if (totalCharsLeft === origCounterValue) {
        // error message
        $errorMsg.html(`${warningHTML}No message found, please write something${warningHTML}`);
        $errorMsg.slideDown("slow");
        return;
      }

      if (totalCharsLeft < 0) {
        // error message
        $errorMsg.html(`${warningHTML}Your tweet is too long! Don't forget about that ${origCounterValue} character limit! ...sorry...${warningHTML}`);
        $errorMsg.slideDown("slow");
        return;
      }
    });

    // happy path
    // do the tweet creation not after the slideUp function, but simultaneously, which means handling the booleans again
    if (!(totalCharsLeft === origCounterValue || totalCharsLeft < 0)) {
      const dataQueryString = $newTweetForm.serialize();

      // clear form
      $('#tweet-text').val('');

      $.ajax({
        method: 'POST',
        url: '/tweets/',
        data: dataQueryString
      }).then(function() {
        loadTweets();
        console.log('request has resolved');
      });
    }
  };

  loadTweets();
  $newTweetForm.on('submit', validateFormAndAjax);
});