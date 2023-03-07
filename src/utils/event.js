const { EventEmitter } = require('node:events');

/**
 * Event bridge between nodes.
 */
class EventBridge extends EventEmitter {
    constructor() {
        super();
    }
}

const eventBridge = new EventBridge();

module.exports = {
    eventBridge
};
