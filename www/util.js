(function () {
  var util = window.util = window.util || {};
  var UNSET = {};

  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function _requestAnimationFrame(callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  util.debounce = function debounce(func, options) {
    var pending = UNSET;
    var delayFn = requestAnimationFrame;

    if (options && options.delay > 0) {
      delayFn = function (fn) {
        setTimeout(fn, options.delay);
      };
    }

    return function debounced(arg) {
      if (pending === UNSET) {
        delayFn(function () {
          func(pending);
          pending = UNSET;
        });
      }

      pending = arg;
    }
  }
}());
