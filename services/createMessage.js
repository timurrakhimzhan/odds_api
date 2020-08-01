"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createMessage(message, obj) {
    if (obj) {
        return JSON.stringify(Object.assign({ message: message }, obj));
    }
    return JSON.stringify({ message: message });
}
exports.createMessage = createMessage;
