const _ = require('lodash');
const { v4 } = require('uuid');
const axios = require('axios').default;
const {
    API_URL_IHOST_CALLBACK,
    API_URL_GET_DEVICE_LIST,
    API_URL_ADD_THIRDPARTY_DEVICE,
    API_URL_UPLOAD_THIRDPARTY_DEVICE_ONLINE,
    EVENT_NODE_RED_ERROR,
    TAG_API_SERVER_NODE_ID,
    TAG_REG_DEV_NODE_ID,
    TAG_THIRDPARTY_DEVICE_ID,
    CAPA_MAP
} = require('./utils/const');

/**
 * Build capabilities array.
 *
 * @param {string} capaJsonData Capabilities data
 */
function buildCapabilities(capaJsonData) {
    // capaData example:
    // {
    //     toggleNum: '1',
    //     values: ['power']
    // }
    const capaData = JSON.parse(capaJsonData);
    const toggleNum = parseInt(capaData.toggleNum);
    const result = [];
    for (const value of capaData.values) {
        const found = _.find(CAPA_MAP, { capability: value });
        if (!found) {
            continue;
        } else {
            if (value === 'toggle') {
                for (let i = 0; i < toggleNum; i++) {
                    const copy = _.cloneDeep(found);
                    _.set(copy, 'name', `${i+1}`);
                    result.push(copy);
                }
            } else {
                result.push(found);
            }
        }
    }
    return result;
}

module.exports = function (RED) {
    function RegisterDeviceNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // If this node registered a device, then set it online.
        const apiServerNodeId = config.server;
        const thirdpartyDevId = config.device_id.trim();
        if (apiServerNodeId && thirdpartyDevId) {
            axios.post(`http://127.0.0.1:1880${API_URL_GET_DEVICE_LIST}`, { id: apiServerNodeId })
                .then((res) => {
                    if (res.data.error === 0) {     // Request success.
                        // Find the registered device.
                        const deviceList = res.data.data.device_list;
                        let found = null
                        for (const dev of deviceList) {
                            const devId = _.get(dev, `tags.${TAG_THIRDPARTY_DEVICE_ID}`);
                            if (devId === thirdpartyDevId) {
                                found = dev;
                            }
                        }

                        // Call online API.
                        if (found) {
                            const onlineCmd = { online: true };
                            const reqData = {
                                id: apiServerNodeId,
                                deviceId: found.serial_number,
                                thirdPartyDeviceId: thirdpartyDevId,
                                params: JSON.stringify(onlineCmd)
                            };
                            axios.post(`http://127.0.0.1:1880${API_URL_UPLOAD_THIRDPARTY_DEVICE_ONLINE}`, reqData);
                        }
                    }
                });
        }

        node.on('input', () => {
            const server = config.server.trim();
            const deviceId = config.device_id.trim();
            const deviceName = config.device_name.trim();
            const category = config.category.trim();
            const capabilities = config.capabilities.trim();
            const manufacturer = config.manufacturer.trim();
            const model = config.model.trim();
            const firmwareVersion = config.firmware_version.trim();
            const serviceAddress = config.service_address.trim();
            let tags = config.tags.trim();
            let state = config.state.trim();

            if (!server) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no server' });
                return;
            }

            if (!deviceId) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no device ID' });
                return;
            }

            if (!deviceName) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no device name' });
                return;
            }

            if (!manufacturer) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no manufacturer' });
                return;
            }

            if (!model) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no model' });
                return;
            }

            if (!firmwareVersion) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no firmware version' });
                return;
            }

            if (!serviceAddress) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no service address' });
                return;
            }

            if (!tags) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no tags' });
                return;
            }

            if (!state) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: no state' });
                return;
            }

            try {
                tags = JSON.parse(tags);
            } catch (err) {
                console.error(err);
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: tags should be JSON' })
                return;
            }

            try {
                state = JSON.parse(state);
            } catch (err) {
                console.error(err);
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'register-device: state should be JSON' })
                return;
            }

            // Store API server node ID in tags
            _.set(tags, TAG_API_SERVER_NODE_ID, server);
            _.set(tags, TAG_REG_DEV_NODE_ID, node.id);
            _.set(tags, TAG_THIRDPARTY_DEVICE_ID, deviceId);

            const params = [
                {
                    name: deviceName,
                    third_serial_number: deviceId,
                    manufacturer,
                    model,
                    firmware_version: firmwareVersion,
                    display_category: category,
                    capabilities: buildCapabilities(capabilities),
                    state,
                    tags,
                    service_address: `http://${serviceAddress}:1880${API_URL_IHOST_CALLBACK}`
                }
            ]
            const data = {
                id: config.server,
                params: JSON.stringify(params)
            };
            axios.post(`http://127.0.0.1:1880${API_URL_ADD_THIRDPARTY_DEVICE}`, data)
                .then((res) => {
                    const errNum = _.get(res, 'data.error');
                    if (typeof errNum === 'number' && errNum !== 0) {
                        node.status({ fill: 'red', shape: 'ring', text: RED._('register-device.message.connect_fail') });
                    } else {
                        node.status({ text: '' });
                    }
                    node.send({ payload: res.data });
                })
                .catch((err) => {
                    node.status({ fill: 'red', shape: 'ring', text: RED._('register-device.message.connect_fail') });
                    node.error(err);
                });
        });
    }

    // Handle iHost callback.
    RED.httpAdmin.post(API_URL_IHOST_CALLBACK, (req, res) => {
        const apiServerNodeId = _.get(req, `body.directive.endpoint.tags.${TAG_API_SERVER_NODE_ID}`);
        const apiServerNode = RED.nodes.getNode(apiServerNodeId);
        const regDevNodeId = _.get(req, `body.directive.endpoint.tags.${TAG_REG_DEV_NODE_ID}`);
        const regDevNode = RED.nodes.getNode(regDevNodeId);
        const failedResponse = {
            event: {
                header: {
                    name: 'ErrorResponse',
                    message_id: v4(),
                    version: '1'
                },
                payload: {
                    type: 'ENDPOINT_UNREACHABLE'
                }
            }
        };
        const successResponse = {
            event: {
                header: {
                    name: 'UpdateDeviceStatesResponse',
                    message_id: v4(),
                    version: '1'
                },
                payload: {}
            }
        };
        let response = null;
        if (apiServerNodeId && apiServerNode && regDevNodeId && regDevNode) {
            response = successResponse;
        } else {
            response = failedResponse;
        }
        if (regDevNode) {
            regDevNode.send({ payload: req.body.directive });
        }
        res.send(JSON.stringify(response));
    });

    RED.nodes.registerType('register-device', RegisterDeviceNode);
};
