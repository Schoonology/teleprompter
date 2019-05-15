$(function () {
  var $source = $(new EventSource(String(window.location) + '/events'));
  var $content = $('.content');
  var $flipButton = $('.flip-button');
  var $contentContainer = $('.content-container');
  var $statusIndicator = $('.status-indicator');
  var $breaks = $('p');
  var speedVec = 0;
  var MAX_SPEED = 300;

  var flipped = 0;

  FastClick.attach(document.body);

  $source
    .on('error', function () {
      $statusIndicator.removeClass('open');
      $statusIndicator.addClass('error');
    })
    .on('open', function () {
      $statusIndicator.removeClass('error');
      $statusIndicator.addClass('open');
    })
    .on('content', function () {
      window.location.reload();
    })
    .on('position', function (event) {
      var data = JSON.parse(event.originalEvent.data);

      setDelta(0);
      setPosition(data.y);

      recalculateAnimation();
    })
    .on('speed', function (event) {
      var data = JSON.parse(event.originalEvent.data);

      speedVec = data.speed;

      recalculateAnimation();
    })
    .on('jump', function (event) {
      if (flipped) {
        $contentContainer.removeClass('flip-y');
      }
      var data = JSON.parse(event.originalEvent.data);
      var targetTop = $content.offset().top - $content.position().top;
      var minimum = $('.indicator').innerHeight() / 2;
      var deltaTop = 0;

      $breaks
        .map(function (_, el) {
          // The 2 here is adjusting for the margin on `.content`.
          return ($(el).offset().top - 2 - targetTop) * data.direction;
        })
        .filter(function (_, elTop) {
          return elTop > 0;
        })
        .each(function (_, elTop) {
          if (!deltaTop || elTop > minimum && elTop < deltaTop) {
            deltaTop = elTop;
          }
        });
      if (flipped) {
        $contentContainer.addClass('flip-y');
      }
      if (deltaTop) {
        setDelta(0);
        setPosition(getPosition() + deltaTop * data.direction);
        recalculateAnimation();
      }
    });

  $contentContainer.toggleClass('flip-y', flipped = Boolean(Number(localStorage.getItem('flip'))));
  $flipButton.click(function () {
    $contentContainer.toggleClass('flip-y');
    localStorage.setItem('flip', flipped = Number($contentContainer.hasClass('flip-y')));
  });

  function getPosition() {
    var pos = $content.position().top * -1;
    if (flipped) {
      pos = $content.height() - pos;
    }
    return pos;
  }

  function setPosition(distance) {
    $content.css('transform', 'translate3d(0, ' + -distance + 'px, 0)');
  }

  function setDelta(delta) {
    $content.css('transition', 'all linear ' + delta + 's');
  }

  recalculateAnimation = util.debounce(recalculateAnimation);
  function recalculateAnimation() {
    // Movement in animation is calculated as a function of time such that:
    //
    //     newPosition = oldPosition + velocity * deltaTime
    //
    // To capitalized on all CSS animations have to offer, what we want to do is
    // _set_ newPosition to the furthest extreme of the scrolling animation, and
    // solve the above formula for `deltaTime`, giving us the duration of the
    // _transition_ instead. A little algebra later...
    var deltaTime = ($content.innerHeight() - getPosition()) / (speedVec * MAX_SPEED);

    setDelta(isFinite(deltaTime) ? deltaTime : 0);

    if (speedVec === 0) {
      setPosition(getPosition());
      return;
    }

    // The transition will only restart if the desired value is different than
    // before. To ensure this is _always_ the case, we add a small jitter to
    // the value.
    setPosition($content.innerHeight() + Math.random());
  }
});
