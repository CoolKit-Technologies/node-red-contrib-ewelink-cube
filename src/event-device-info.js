const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_UPDATE_DEVICE_INFO } = require('./utils/const');

module.exports = function (RED) {
    function GetDevicesInfoNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnUpdateDeviceHandler(jsonData) {
            const data = JSON.parse(jsonData);
            if (config.server === data.srcNodeId) {
                const deviceData = JSON.parse(data.msg.data);
                // Empty device field means all.
                if (!config.device || config.device === deviceData.endpoint.serial_number || config.device === 'all') {
                    node.send({ payload: data.msg.data });
                }
            }
        }

        eventBridge.on(EVENT_SSE_ON_UPDATE_DEVICE_INFO, eventSseOnUpdateDeviceHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_UPDATE_DEVICE_INFO, eventSseOnUpdateDeviceHandler);
            done();
        });
    }

    RED.nodes.registerType('event-device-info', GetDevicesInfoNode);
};
