const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_ADD_DEVICE } = require('./utils/const');

module.exports = function (RED) {
    function EventAddDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnAddDeviceHandler(jsonData) {
            const data = JSON.parse(jsonData);
            if (config.server === data.srcNodeId) {
                node.send({ payload: data.msg.data });
            }
        }

        eventBridge.on(EVENT_SSE_ON_ADD_DEVICE, eventSseOnAddDeviceHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_ADD_DEVICE, eventSseOnAddDeviceHandler);
            done();
        });
    }

    RED.nodes.registerType('event-add-device', EventAddDeviceNode);
};
