"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClickOutside = void 0;
var react_1 = require("react");
function useClickOutside(handler) {
    var domNodeRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!handler)
            return;
        if (!window)
            return;
        var controller = new AbortController();
        var signal = controller.signal;
        var elOptions = {
            passive: true,
            signal: signal,
        };
        var maybeHandler = function (event) {
            // Check if the click is outside the referenced DOM node
            if (!domNodeRef.current)
                return;
            if (!domNodeRef.current.contains(event.target)) {
                handler(event);
            }
        };
        window.addEventListener("touchstart", maybeHandler, elOptions);
        window.addEventListener("mousedown", maybeHandler, elOptions);
        return function () {
            controller.abort(); // Abort the listeners using the controller
        };
    }, [handler]);
    return domNodeRef;
    // return domNodeRef;
}
exports.default = useClickOutside;
exports.useClickOutside = useClickOutside;
