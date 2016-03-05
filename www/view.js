$(function () {
  var $source = $(new EventSource(String(window.location) + '/events'));
  var $content = $('.content');
  var $flipButton = $('.flip-button');
  var $contentContainer = $('.content-container');
  var speedVec = 0;
  var MAX_SPEED = 300;

  $source
    .on('content', function () {
      window.location.reload();
    })
    .on('position', function (event) {
      var data = JSON.parse(event.originalEvent.data);

      setDelta(0);
      setPosition(data.y);

      requestAnimationFrame(recalculateAnimation);
    })
    .on('speed', function (event) {
      var data = JSON.parse(event.originalEvent.data);

      speedVec = data.speed;

      recalculateAnimation();
    });

  $flipButton.click(function () {
    $contentContainer.toggleClass('flip-y');
  });

  function getPosition() {
    return Math.abs($content.position().top);
  }

  function setPosition(distance) {
    $content.css('transform', 'translate3d(0, -' + distance + 'px, 0)');
  }

  function setDelta(delta) {
    $content.css('transition', 'all linear ' + delta + 's');
  }

  function recalculateAnimation() {
    // Movement in animation is calculated as a function of time such that:
    //
    //     newPosition = oldPosition + velocity * deltaTime
    //
    // To capitalized on all CSS animations have to offer, what we want to do is
    // _set_ newPosition to the furthest extreme of the scrolling animation, and
    // solve the above formula for `deltaTime`, giving us the duration of the
    // _transition_ instead. A little algebra later...
    var deltaTime = ($content.outerHeight() - getPosition()) / (speedVec * MAX_SPEED);

    setDelta(deltaTime);

    if (speedVec === 0) {
      setPosition(getPosition());
      return;
    }

    // The transition will only restart if the desired value is different than
    // before. To ensure this is _always_ the case, we add a small jitter to
    // the value.
    setPosition($content.outerHeight() + Math.random());
  }
});
