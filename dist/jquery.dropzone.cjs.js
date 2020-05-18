/*!
 * jquery.dropzone 1.0.6
 * git://github.com/danielgindi/jquery.dropzone.git
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jQuery = _interopDefault(require('jquery'));

const $ = jQuery;

/**
                   * @typedef {Object} DropZone~Options
                   * @property {String|jQuery|undefined|null} [append=null] - jQuery expression/element to append to the dropzone
                   * @property {function(dataTransfer):Boolean} [allowDrop] - A function that determines whether we allow dropping or not
                   */

/** @type {DropZone~Options} */
let defaultOptions = {
  append: null };


class DropZone {
  /**
                 * @param {Element} el
                 * @param {DropZone~Options} options
                 */
  constructor(el, options) {
    /** @type {DropZone~Options} */
    this.options = $.extend({}, defaultOptions, options);

    let globalDragCounter = 0,
    innerDragCounter = 0;

    let $dropZone = this.$el = $(el);
    let $dropZoneAppend = options.append ? $(options.append) : null;

    // For jQuery.UI or jquery.removeevent
    this.$el.on('remove', () => {
      this.destroy();
    });

    let innerDragOver, innerDragEnter, innerDragLeave, innerDragDrop, startGlobalDrag, allowGlobalDrag, endGlobalDrag, globalDrop;

    innerDragOver = function (event) {
      if (typeof options.allowDrop === 'function' &&
      !options.allowDrop(event.originalEvent.dataTransfer)) return;

      event.preventDefault();
    };

    innerDragEnter = function (event) {
      if (typeof options.allowDrop === 'function' &&
      !options.allowDrop(event.originalEvent.dataTransfer)) {
        event.preventDefault();
        return;
      }

      if (typeof event !== 'undefined') {
        innerDragCounter++;
        if (innerDragCounter !== 1) {
          return;
        }
      }

      $dropZone.addClass('drop-over');

      if ($dropZoneAppend) {
        $dropZoneAppend.addClass('drop-over');
      }
    };

    innerDragLeave = function () {
      if (typeof event !== 'undefined') {
        innerDragCounter = Math.max(innerDragCounter - 1, 0);
        if (innerDragCounter > 0) {
          return;
        }
      } else {
        innerDragCounter = 0;
      }

      $dropZone.removeClass('drop-over');

      if ($dropZoneAppend) {
        $dropZoneAppend.removeClass('drop-over');
      }
    };

    innerDragDrop = function () {
      endGlobalDrag();
    };

    startGlobalDrag = function (event) {
      if (typeof options.allowDrop === 'function' &&
      !options.allowDrop(event.originalEvent.dataTransfer)) {
        event.preventDefault();
        return;
      }

      if (typeof event !== 'undefined') {
        globalDragCounter++;
        if (globalDragCounter !== 1) {
          return;
        }
      }

      $dropZone.addClass('drop-available');

      if ($dropZoneAppend) {
        $dropZoneAppend.appendTo($dropZone);
      }

      ($dropZoneAppend || $dropZone).
      on('dragover', innerDragOver).
      on('dragenter', innerDragEnter).
      on('dragleave', innerDragLeave).
      on('drop', innerDragDrop);
    };

    allowGlobalDrag = function (event) {
      if (typeof options.allowDrop === 'function' &&
      !options.allowDrop(event.originalEvent.dataTransfer)) return;

      event.preventDefault();
    };

    endGlobalDrag = function (event) {
      if (typeof event !== 'undefined') {
        globalDragCounter = Math.max(globalDragCounter - 1, 0);
        if (globalDragCounter > 0) {
          return;
        }
      } else {
        globalDragCounter = 0;
      }

      $dropZone.removeClass('drop-available');

      if ($dropZoneAppend) {
        $dropZoneAppend.detach();
      }

      ($dropZoneAppend || $dropZone).
      off('dragover', innerDragOver).
      off('dragenter', innerDragEnter).
      off('dragleave', innerDragLeave).
      off('drop', innerDragDrop);

      innerDragLeave();
    };

    globalDrop = function (_event) {
      setTimeout(() => {
        endGlobalDrag();
      }, 0);
    };

    $(window).
    on('dragover', allowGlobalDrag).
    on('dragenter', startGlobalDrag).
    on('dragleave', endGlobalDrag).
    on('drop', globalDrop);

    $dropZone.data('global-dropzone', {
      allowGlobalDrag: allowGlobalDrag,
      startGlobalDrag: startGlobalDrag,
      endGlobalDrag: endGlobalDrag,
      globalDrop: globalDrop });

  }

  destroy() {

    if (!this.$el) return;

    let $dropZone = this.$el;
    let dropData = $dropZone.data('global-dropzone');

    if (dropData) {
      $(window).
      off('dragover', dropData.allowGlobalDrag).
      off('dragenter', dropData.startGlobalDrag).
      off('dragleave', dropData.endGlobalDrag).
      off('drop', dropData.globalDrop);
      dropData.endGlobalDrag();
      $dropZone.removeData('global-dropzone');
    }

    if ($dropZone.data('dropzone') == this) {
      $dropZone.removeData('dropzone');
    }

    this.options = null;
  }}


/**
      *
      * @param {DropZone~Options|String} options - Options for constructing the DropZone, or name of function to call
      * @returns {$}
      */
$.fn.dropzone = function (options) {
  let args = arguments;

  let returnValues;

  this.each(function (eachIndex) {
    let $this = $(this),
    obj = $this.data('dropzone');

    if (typeof args[0] === 'string') {
      if (obj && typeof obj[args[0]] === 'function') {

        // Call the method
        let returnValue = obj[args[0]].apply(obj, Array.prototype.slice.call(args, 1));
        if (returnValue === obj) {// If a method is chaining
          returnValue = undefined;
        }
        if (returnValue !== undefined) {
          returnValues = returnValues || [];
          returnValues[eachIndex] = returnValue;
        }

        return; // Nothing further to do

      }

      return;
    }

    if (obj) {
      try {
        obj.destroy();
      } catch (ignored) {
        // Nothing to do here
      }
    }

    options = /** @type {DropZone~Options} */$.extend({}, options || {});
    obj = new DropZone(this, options);
    $this.data('dropzone', obj);
  });

  return returnValues ?
  returnValues.length === 1 ? returnValues[0] : returnValues :
  this;
};

module.exports = DropZone;

//# sourceMappingURL=jquery.dropzone.cjs.js.map