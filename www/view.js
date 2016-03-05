document.addEventListener('DOMContentLoaded', function () {
  var es = new EventSource(String(window.location) + '/events');
  var content = document.querySelector('.content');
  var speed = 0;
  var lastTick = Date.now();
  var lastPosition = 0;

  es.addEventListener('position', function (event) {
    var data = JSON.parse(event.data);

    lastPosition = data.y;
  });

  es.addEventListener('speed', function (event) {
    var data = JSON.parse(event.data);

    speed = data.speed;
  });

  document.querySelector('.flip-button').addEventListener('click', function () {
    var contentContainer = document.querySelector('.content-container');

    if (contentContainer.classList.contains('flip-y')) {
      contentContainer.classList.remove('flip-y');
    } else {
      contentContainer.classList.add('flip-y');
    }
  });

  setInterval(function () {
    var diff = Date.now() - lastTick;
    var top = lastPosition + speed * 300 * (diff / 1000);

    lastTick = Date.now();
    lastPosition = top;

    if (top > content.getBoundingClientRect().height) {
      top = content.getBoundingClientRect().height;
    }

    content.style.transition = 'all linear ' + diff + 'ms';
    content.style.transform = 'translate3d(0, -' + top + 'px, 0)';
    content.style.WebkitTransform = 'translate3d(0, -' + top + 'px, 0)';
  }, 100);
});
