const { eventBridge } = require('./utils/event');
const { EVENT_SSE_ON_UPDATE_DEVICE_STATE } = require('./utils/const');
module.exports = function (RED) {
    function GetStateNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        function eventSseOnAllStateDeviceHandler(jsonData) {
            const data = JSON.parse(jsonData);
            if (config.server === data.srcNodeId) {
                const deviceData = JSON.parse(data.msg.data);
                const playload = JSON.parse(JSON.stringify(deviceData.payload));
                const KeyName = Object.keys(playload).join('');
                let list = config.list+config.state;
                if(config.device === 'all' || !config.device){
                    node.send({ payload: data.msg.data });
                    return;
                }
                if(config.device === deviceData.endpoint.serial_number && (config.state || config.list)){
                    if(list.indexOf(KeyName)!== -1 || config.state === 'all'){
                        node.send({ payload: data.msg.data });
                    }
                }
            }
        }

        eventBridge.on(EVENT_SSE_ON_UPDATE_DEVICE_STATE, eventSseOnAllStateDeviceHandler);

        node.on('close', (done) => {
            eventBridge.off(EVENT_SSE_ON_UPDATE_DEVICE_STATE, eventSseOnAllStateDeviceHandler);
            done();
        });
    }

    RED.nodes.registerType('event-state', GetStateNode);
};
