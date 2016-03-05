$(function () {
  var $source = $(new EventSource(String(window.location) + '/events'));
  var $content = $('.content');
  var $flipButton = $('.flip-button');
  var $contentContainer = $('.content-container');
  var speed = 0;
  var lastTick = Date.now();
  var lastPosition = 0;

  $source
    .on('content', function () {
      window.location.reload();
    })
    .on('position', function (event) {
      var data = JSON.parse(event.originalEvent.data);

      lastPosition = data.y;
    })
    .on('speed', function (event) {
      var data = JSON.parse(event.originalEvent.data);

      speed = data.speed;
    });

  $flipButton.click(function () {
    $contentContainer.toggleClass('flip-y');
  });

  setInterval(function () {
    var diff = Date.now() - lastTick;
    var top = lastPosition + speed * 300 * (diff / 1000);

    lastTick = Date.now();
    lastPosition = top;

    if (top > $content.outerHeight()) {
      top = $content.outerHeight();
    }

    $content
      .css('transition', 'all linear ' + diff + 'ms')
      .css('transform', 'translate3d(0, -' + top + 'px, 0)');
  }, 100);
});
