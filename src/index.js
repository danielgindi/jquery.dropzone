'use strict';

import jQuery from 'jquery';

const $ = jQuery;

/**
 * @typedef {Object} DropZone~Options
 * @property {String|jQuery|undefined|null} [append=null] - jQuery expression/element to append to the dropzone
 * @property {function(dataTransfer):Boolean} [allowDrop] - A function that determines whether we allow dropping or not
 */

/** @type {DropZone~Options} */
var defaultOptions = {
    append: null
};

/**
 * @constructor
 * @param {Element} el
 * @param {DropZone~Options} options
 */
var DropZone = function (el, options) {

    var that = this;

    /** @type {DropZone~Options} */
    that.options = $.extend({}, defaultOptions, options);

    var globalDragCounter = 0,
        innerDragCounter = 0;

    var $dropZone = that.$el = $(el);
    var $dropZoneAppend = options.append ? $(options.append) : null;

    // For jQuery.UI or jquery.removeevent
    that.$el.on('remove', function () {
        that.destroy();
    });

    var innerDragOver = function (event) {
        
        if (typeof options.allowDrop === 'function' 
            && !options.allowDrop(event.originalEvent.dataTransfer)) return;
            
        event.preventDefault();

    };

    var innerDragEnter = function (event) {
        
        if (typeof options.allowDrop === 'function' 
            && !options.allowDrop(event.originalEvent.dataTransfer)) {
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

    var innerDragLeave = function () {

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

    var innerDragDrop = function () {
        endGlobalDrag();
    };

    var startGlobalDrag = function (event) {
        
        if (typeof options.allowDrop === 'function' 
            && !options.allowDrop(event.originalEvent.dataTransfer)) {
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

        ($dropZoneAppend || $dropZone)
            .on('dragover', innerDragOver)
            .on('dragenter', innerDragEnter)
            .on('dragleave', innerDragLeave)
            .on('drop', innerDragDrop);

    };

    var allowGlobalDrag = function (event) {
        
        if (typeof options.allowDrop === 'function' 
            && !options.allowDrop(event.originalEvent.dataTransfer)) return;

        event.preventDefault();

    };

    var endGlobalDrag = function (event) {

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

        ($dropZoneAppend || $dropZone)
            .off('dragover', innerDragOver)
            .off('dragenter', innerDragEnter)
            .off('dragleave', innerDragLeave)
            .off('drop', innerDragDrop);

        innerDragLeave();

    };

    var globalDrop = function (event) {

        setTimeout(function () {
            endGlobalDrag();
        }, 0);

    };

    $(window)
        .on('dragover', allowGlobalDrag)
        .on('dragenter', startGlobalDrag)
        .on('dragleave', endGlobalDrag)
        .on('drop', globalDrop);

    $dropZone.data('global-dropzone', {
        allowGlobalDrag: allowGlobalDrag,
        startGlobalDrag: startGlobalDrag,
        endGlobalDrag: endGlobalDrag,
        globalDrop: globalDrop
    });

};

DropZone.prototype.destroy = function () {

    if (!this.$el) return;

    var $dropZone = this.$el;
    var dropData = $dropZone.data('global-dropzone');

    if (dropData) {
        $(window)
            .off('dragover', dropData.allowGlobalDrag)
            .off('dragenter', dropData.startGlobalDrag)
            .off('dragleave', dropData.endGlobalDrag)
            .off('drop', dropData.globalDrop);
        dropData.endGlobalDrag();
        $dropZone.removeData('global-dropzone');
    }

    if ($dropZone.data('dropzone') == this) {
        $dropZone.removeData('dropzone');
    }

    this.options = null;
};

/**
 *
 * @param {DropZone~Options|String} options - Options for constructing the DropZone, or name of function to call
 * @returns {$}
 */
$.fn.dropzone = function (options) {
    var args = arguments;

    var returnValues;

    this.each(function (eachIndex) {
        var $this = $(this)
            , obj = $this.data('dropzone');

        if (typeof args[0] === 'string') {
            if (obj && typeof obj[args[0]] === 'function') {

                // Call the method
                var returnValue = obj[args[0]].apply(obj, Array.prototype.slice.call(args, 1));
                if (returnValue === obj) { // If a method is chaining
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
            } catch (e) {

            }
        }

        options = /** @type {DropZone~Options} */ $.extend({}, options || {});
        obj = new DropZone(this, options);
        $this.data('dropzone', obj);
    });

    return returnValues
        ? (returnValues.length === 1 ? returnValues[0] : returnValues)
        : this;
};

export default DropZone