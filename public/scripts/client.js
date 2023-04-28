$(document).ready(function() {
  const createTweetElement = function(tweet) {

    // Implementing jQuery HTML data so as to avoid XSS attacks

    const $tweetElement = $(`<article>`);
    $tweetElement.addClass('tweet-container');

    // handle header data
    // potentially inputted data is handled with functions that escape potentially insecure text
    const $tweetHeader = $(`<header>
    <div class="author-name-and-avatar">
      <div class="author-avatar"><img /></div>
      <div class="author-name">Newton</div>
    </div>
    <div class="author-handle">@SirIsaac</div>
  </header>`);
    const $img = $tweetHeader.find('img');
    $img.attr('src', tweet.user.avatars);
    const $authorNameDiv = $tweetHeader.find('div.author-name');
    $authorNameDiv.text(tweet.user.name);
    const $authorHandle = $tweetHeader.find('div.author-handle');
    $authorHandle.text(tweet.user.handle);

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
    // empty #tweets-container, iterate through each tweet and add tweet elements in reverse chronological order
    const $tweetsContainer = $('#tweets-container');
    $tweetsContainer.empty();
    for (const tweet of tweetsArr) {
      const $tweet = createTweetElement(tweet);
      $tweetsContainer.prepend($tweet);
    }
  };

  const loadTweets = function() {
    // fetch tweets from '/tweets' route
    $.ajax({
      method: 'GET',
      url: '/tweets',
    }).then(function(tweets) {
      renderTweets(tweets);
    });
  };

  // traverse from element with id #tweet-text to get the char counter number from the original DOM data, and to get the form for a new tweet
  const origCounterValue = Number($('#tweet-text').parent().find('.counter').html());
  const $newTweetForm = $('#tweet-text').parent();

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
        // show error message
        $errorMsg.html(`${warningHTML}No message found, please write something${warningHTML}`);
        $errorMsg.slideDown("slow");
        return;
      }

      if (totalCharsLeft < 0) {
        // show error message
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

      // POST request to add tweet via '/tweets/' route
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