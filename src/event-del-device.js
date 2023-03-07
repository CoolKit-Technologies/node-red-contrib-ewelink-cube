const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_DELETE_DEVICE } = require('./utils/const');

module.exports = function (RED) {
    function EventDelDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnDelDeviceHandler(jsonData) {
            const data = JSON.parse(jsonData);
            if (config.server === data.srcNodeId) {
                const deviceData = JSON.parse(data.msg.data);
                // Empty device field means all.
                if (!config.device || config.device === deviceData.endpoint.serial_number || config.device === 'all') {
                    node.send({ payload: data.msg.data });
                }
            }
        }

        eventBridge.on(EVENT_SSE_ON_DELETE_DEVICE, eventSseOnDelDeviceHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_DELETE_DEVICE, eventSseOnDelDeviceHandler);
            done();
        });
    }

    RED.nodes.registerType('event-del-device', EventDelDeviceNode);
};
