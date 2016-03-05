document.addEventListener('DOMContentLoaded', function () {
  var speedControl = document.querySelector('.speed');
  var speedIndicator = document.querySelector('.speed__indicator');
  var playButton = document.querySelector('.play');
  var backButton = document.querySelector('.back');
  var down = false;
  var speed = 0;

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
    var rect = speedControl.getBoundingClientRect();
    var pct = event.clientX / rect.width;

    setSpeed(pct);
  }

  function setSpeed(normal) {
    var left = normal * 100 + '%';

    speedIndicator.style.left = left;
    speed = Math.pow(normal, 2);

    if (!playButton.classList.contains('paused')) {
      postEvent({ type: 'speed', speed: speed });
    }
  }

  speedControl.addEventListener('mousedown', function (e) {
    e.preventDefault();

    updateSpeed(e);

    down = true;
  });

  document.addEventListener('mouseup', function (e) {
    e.preventDefault();

    down = false;
  })

  document.addEventListener('mousemove', function (e) {
    e.preventDefault();

    if (down) {
      updateSpeed(e);
    }
  });

  speedControl.addEventListener('touchstart', function (e) {
    e.preventDefault();

    updateSpeed(e.changedTouches[0]);
  });

  speedControl.addEventListener('touchmove', function (e) {
    e.preventDefault();

    updateSpeed(e.changedTouches[0]);
  });

  playButton.addEventListener('click', function (e) {
    if (playButton.classList.contains('paused')) {
      postEvent({ type: 'speed', speed: speed });

      playButton.classList.remove('paused')
    } else {
      postEvent({ type: 'speed', speed: 0 });

      playButton.classList.add('paused')
    }
  });

  backButton.addEventListener('click', function (e) {
    postEvent({ type: 'position', y: 0 });
  });
});
