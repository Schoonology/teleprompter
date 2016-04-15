$(function () {
  var $source = $(new EventSource(String(window.location) + '/../events'));
  var $speed = $('.speed');
  var $speedIndicator = $('.speed__indicator');
  var $speedDisplay = $('.status-bar__speed');
  var $statusIndicator = $('.status-bar__connectivity');
  var $play = $('.play');
  var $reset = $('.reset');
  var $back = $('.back');
  var $forward = $('.forward');
  var down = false;
  var speed = 0;

  FastClick.attach(document.body);

  $source
    .on('error', function () {
      $statusIndicator.removeClass('open');
      $statusIndicator.addClass('error');
    })
    .on('open', function () {
      $statusIndicator.removeClass('error');
      $statusIndicator.addClass('open');
    });

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
        $statusIndicator.removeClass('error');
        $statusIndicator.addClass('open');
      }, function (error) {
        $statusIndicator.removeClass('open');
        $statusIndicator.addClass('error');
      });
  }

  var postSpeedEvent = util.debounce(function postSpeedEvent(speed) {
    postEvent({ type: 'speed', speed: speed });
  }, {
    delay: 100
  });

  function updateSpeed(event) {
    var x = event.clientX - $speed.offset().left;
    var pct = x / $speed.outerWidth();

    setSpeed(pct);
  }

  function setSpeed(normal) {
    normal = Math.max(Math.min(normal, 1), 0);

    $speedIndicator.css('left', normal * 100 + '%');
    $speedDisplay.html(Math.round(normal * 1000) / 10);

    speed = Math.pow(normal, 2);

    if (!$play.hasClass('paused')) {
      postSpeedEvent(speed);
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

  $back.click(function (e) {
    postEvent({ type: 'jump', direction: -1 });
  });

  $forward.click(function (e) {
    postEvent({ type: 'jump', direction: 1 });
  });
});
