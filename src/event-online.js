const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_UPDATE_DEVICE_ONLINE } = require('./utils/const');

module.exports = function (RED) {
    function EventOnlineNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnUpdateDeviceOnlineHandler(jsonData) {
            // data.msg template:
            // {
            //     "type": "device#v1updateDeviceOnline"
            //     "lastEventId": ""
            //     "origin": "http://192.168.2.20"
            //     "data": "..."
            // }
            const data = JSON.parse(jsonData);
            if (config.server === data.srcNodeId) {
                const deviceData = JSON.parse(data.msg.data);
                // Empty device field means all.
                if (!config.device || config.device === deviceData.endpoint.serial_number || config.device === 'all') {
                    node.send({ payload: data.msg.data });
                }
            }
        }

        eventBridge.on(EVENT_SSE_ON_UPDATE_DEVICE_ONLINE, eventSseOnUpdateDeviceOnlineHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_UPDATE_DEVICE_ONLINE, eventSseOnUpdateDeviceOnlineHandler);
            done();
        });
    }

    RED.nodes.registerType('event-online', EventOnlineNode);
};
