/*!
 * jquery.dropzone 1.0.1
 * git://github.com/danielgindi/jquery.dropzone.git
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("jquery")) : factory(root["jQuery"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var DropZone = function DropZone(el, options) {

	    var that = this;

	    that.options = options;

	    var globalDragCounter = 0,
	        innerDragCounter = 0;

	    var $dropZone = that.$el = (0, _jquery2['default'])(el);
	    var $dropZoneAppend = options.append ? (0, _jquery2['default'])(options.append) : null;

	    // For jQuery.UI or jquery.removeevent
	    that.$el.on('remove', function () {
	        that.destroy();
	    });

	    var innerDragOver = function innerDragOver(event) {

	        event.preventDefault();
	    };

	    var innerDragEnter = function innerDragEnter(event) {

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

	    var innerDragLeave = function innerDragLeave() {

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

	    var innerDragDrop = function innerDragDrop() {
	        endGlobalDrag();
	    };

	    var startGlobalDrag = function startGlobalDrag(event) {

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

	        ($dropZoneAppend || $dropZone).on('dragover', innerDragOver).on('dragenter', innerDragEnter).on('dragleave', innerDragLeave).on('drop', innerDragDrop);
	    };

	    var allowGlobalDrag = function allowGlobalDrag(event) {

	        event.preventDefault();
	    };

	    var endGlobalDrag = function endGlobalDrag(event) {

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

	        ($dropZoneAppend || $dropZone).off('dragover', innerDragOver).off('dragenter', innerDragEnter).off('dragleave', innerDragLeave).off('drop', innerDragDrop);

	        innerDragLeave();
	    };

	    var globalDrop = function globalDrop(event) {

	        setTimeout(function () {
	            endGlobalDrag();
	        }, 0);
	    };

	    (0, _jquery2['default'])(window).on('dragover', allowGlobalDrag).on('dragenter', startGlobalDrag).on('dragleave', endGlobalDrag).on('drop', globalDrop);

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
	        (0, _jquery2['default'])(window).off('dragover', dropData.allowGlobalDrag).off('dragenter', dropData.startGlobalDrag).off('dragleave', dropData.endGlobalDrag).off('drop', dropData.globalDrop);
	        dropData.endGlobalDrag();
	        $dropZone.removeData('global-dropzone');
	    }

	    if ($dropZone.data('dropzone') == this) {
	        $dropZone.removeData('dropzone');
	    }

	    this.options = null;
	};

	_jquery2['default'].fn.dropzone = function (options) {
	    var args = arguments;

	    var returnValues;

	    this.each(function (eachIndex) {
	        var $this = (0, _jquery2['default'])(this),
	            obj = $this.data('dropzone');

	        if (typeof args[0] === 'string') {
	            if (obj && typeof obj[args[0]] === 'function') {

	                // Call the method
	                var returnValue = obj[args[0]].apply(obj, Array.prototype.slice.call(args, 1));
	                if (returnValue === obj) {
	                    // If a method is chaining
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

	        options = _jquery2['default'].extend({}, options || {});
	        obj = new DropZone(this, options);
	        $this.data('dropzone', obj);
	    });

	    return returnValues ? returnValues.length === 1 ? returnValues[0] : returnValues : this;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;