$(function () {
  var $speed = $('.speed');
  var $speedIndicator = $('.speed__indicator');
  var $play = $('.play');
  var $reset = $('.reset');
  var down = false;
  var speed = 0;

  FastClick.attach(document.body);

  setSpeed(0.5);

  function postEvent(body) {
    return fetch('events', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
      .then(function (response) {
        console.log('SUCCESS:', response);
      }, function (error) {
        console.log('FAILURE:', error);
      });
  }

  function updateSpeed(event) {
    var x = event.clientX - $speed.offset().left;
    var pct = x / $speed.outerWidth();

    setSpeed(pct);
  }

  function setSpeed(normal) {
    normal = Math.max(Math.min(normal, 1), 0);

    var left = normal * 100 + '%';

    $speedIndicator.css('left', left);
    speed = Math.pow(normal, 2);

    if (!$play.hasClass('paused')) {
      postEvent({ type: 'speed', speed: speed });
    }
  }

  $speed.mousedown(function (e) {
    e.preventDefault();

    updateSpeed(e);

    down = true;
  });

  $(document).bind('touchmove', function(e) {
    e.preventDefault();
  });

  $(document).mouseup(function (e) {
    e.preventDefault();

    down = false;
  })

  $(document).mousemove(function (e) {
    e.preventDefault();

    if (down) {
      updateSpeed(e);
    }
  });

  $speed.bind('touchstart', function (e) {
    e.preventDefault();

    updateSpeed(e.originalEvent.changedTouches[0]);
  });

  $speed.bind('touchmove', function (e) {
    e.preventDefault();

    updateSpeed(e.originalEvent.changedTouches[0]);
  });

  $play.click(function (e) {
    $play.toggleClass('paused');
    $speed.toggleClass('paused');

    if ($play.hasClass('paused')) {
      postEvent({ type: 'speed', speed: 0 });
    } else {
      postEvent({ type: 'speed', speed: speed });
    }
  });

  $reset.click(function (e) {
    postEvent({ type: 'position', y: 0 });
  });
});
