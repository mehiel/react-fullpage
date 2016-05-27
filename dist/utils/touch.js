/**
 * This is a lower level swipe detection function.
 *
 * getTouchEventListeners returns an object with the keys:
 *  onTouchStart: the touch start event listener one should add in an el for swipe
 *  onTouchMove: the touch move event listener one should add in an el for swipe
 *  onTouchEnd: the touch end event listener one should add in an el for swipe
 *
 * Those listeners are properly setup to measure distance and duration of a touch
 * and call the passed callback with swipe related information.
 *
 * callback is called with the arguments bellow:
 *  e: contains original Event object
 *  direction: contains "none", "left", "right", "top", or "down"
 *  phase: contains "start", "move", or "end"
 *  swipetype: contains "none", "left", "right", "top", or "down"
 *  distance: distance traveled either horizontally or vertically, depending on dir value
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getTouchEventListeners = getTouchEventListeners;

function getTouchEventListeners(callback) {
  var dir = undefined;
  var swipeType = undefined;
  var startX = undefined;
  var startY = undefined;
  var distX = undefined;
  var distY = undefined;
  var threshold = 100; //required min distance traveled to be considered swipe
  var restraint = 100; // maximum distance allowed at the same time in perpendicular direction
  var allowedTime = 1000; // maximum time allowed to travel that distance
  var elapsedTime = undefined;
  var startTime = undefined;
  var handletouch = callback || function (evt, dir, phase, swipetype, distance) {};

  var _onTouchStart = function _onTouchStart(e) {
    var touchobj = e.changedTouches[0];
    dir = 'none';
    swipeType = 'none';
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime(); // record time when finger first makes contact with surface
    handletouch(e, 'none', 'start', swipeType, 0); // fire callback function with params dir="none", phase="start", swipetype="none" etc
  };

  var _onTouchMove = function _onTouchMove(e) {
    var touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
    distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
    if (Math.abs(distX) > Math.abs(distY)) {
      // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
      dir = distX < 0 ? 'left' : 'right';
      handletouch(e, dir, 'move', swipeType, distX); // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
    } else {
        // else consider this a vertical movement
        dir = distY < 0 ? 'up' : 'down';
        handletouch(e, dir, 'move', swipeType, distY); // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
      }
  };

  var _onTouchEnd = function _onTouchEnd(e) {
    var touchobj = e.changedTouches[0];
    elapsedTime = new Date().getTime() - startTime; // get time elapsed
    // console.log('onTouchEnd :: ', dir, elapsedTime, elapsedTime <= allowedTime, allowedTime, distY, threshold, distX, restraint);
    if (elapsedTime <= allowedTime) {
      // first condition for awipe met
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        // 2nd condition for horizontal swipe met
        swipeType = dir; // set swipeType to either "left" or "right"
      } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
          // 2nd condition for vertical swipe met
          swipeType = dir; // set swipeType to either "top" or "down"
        }
    }
    // Fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
    handletouch(e, dir, 'end', swipeType, dir == 'left' || dir == 'right' ? distX : distY);
  };

  return {
    onTouchStart: _onTouchStart,
    onTouchMove: _onTouchMove,
    onTouchEnd: _onTouchEnd
  };
}