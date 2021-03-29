/**
 * Created by is4823 on 11/3/2015.
 */
/**
 * Singleton Event Manager to control user and system based interaction.
 */

var EventManager = (function() {
    // Instance stores a reference to the Singleton
    var instance;

    function init() {
        // Singleton
        // Private methods
        function dispatchCustomEvent(controlName, eventName, isBubbling,
                                     dataObj) {
            $(eval(controlName)).trigger({
                type : eventName,
                obj : dataObj
            }, isBubbling);
        }
        function addControlEventListener(controlName, eventName, callBackFn) {
            $(controlName).on(eventName, callBackFn);
        }
        function removeControlEventListener(controlName, eventName, callBackFn) {
            $(controlName).off(eventName, callBackFn);
        }
        return {
            // Public methods which has pointers to the private methods
            dispatchCustomEvent : dispatchCustomEvent,
            addControlEventListener : addControlEventListener,
            removeControlEventListener : removeControlEventListener,
        };
    }

    return {
        // Get the Singleton instance if one exists or create one if it doesn't
        getInstance : function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();
