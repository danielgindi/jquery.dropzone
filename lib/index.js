import jQuery from 'jquery';
import { DropZone, DropZoneOptions } from '@danielgindi/dropzone';

const $ = jQuery;

/**
 *
 * @param {DropZoneOptions|string} options - Options for constructing the DropZone, or name of function to call
 * @returns {$}
 */
jQuery.fn.dropzone = function (options) {
    let args = arguments;

    let returnValues;

    this.each(function (eachIndex) {
        let $this = jQuery(this), obj = $this.data('dropzone');

        if (typeof args[0] === 'string') {
            if (obj && typeof obj[args[0]] === 'function') {

                // Call the method
                let returnValue = obj[args[0]].apply(obj, Array.prototype.slice.call(args, 1));
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
                $this.removeData('dropzone');
            } catch (ignored) {
                // Nothing to do here
            }
        }

        options = $.extend({}, options || {});
        obj = new DropZone(this, options);
        $this.data('dropzone', obj);
    });

    return returnValues
        ? (returnValues.length === 1 ? returnValues[0] : returnValues)
        : this;
};

export default DropZone;
