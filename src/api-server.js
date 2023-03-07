const { ihostApi: ApiClient } = require('./extern/libapi').default;
const { NodeDataCache } = require('./utils/cache');
const { eventBridge } = require('./utils/event');
const {
    API_URL_CACHE_ADD_API_SERVER_NODE,
    API_URL_CACHE_REMOVE_API_SERVER_NODE,
    API_URL_GET_BRIDGE_INFO,
    API_URL_GET_BRIDGE_TOKEN,
    API_URL_GET_DEVICE_LIST,
    API_URL_CONTROL_DEVICE,
    API_URL_TEST_TOKEN,
    API_URL_UPLOAD_THIRDPARTY_DEVICE_STATE,
    API_URL_UPLOAD_THIRDPARTY_DEVICE_ONLINE,
    API_URL_ADD_THIRDPARTY_DEVICE,
    EVENT_SSE_ON_UPDATE_DEVICE_STATE,
    EVENT_SSE_ON_ADD_DEVICE,
    EVENT_SSE_ON_DELETE_DEVICE,
    EVENT_SSE_ON_UPDATE_DEVICE_INFO,
    EVENT_SSE_ON_UPDATE_DEVICE_ONLINE,
    EVENT_NODE_RED_ERROR
} = require('./utils/const');

module.exports = function (RED) {
    const nodeDataCache = new NodeDataCache();

    function ApiServerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        // Clean cache when user clicks deploy button.
        nodeDataCache.clean();
        node.apiClient = null;

        const ip = config.ip.trim();
        const token = config.token.trim();
        if (!ip) {
            RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: no IP' });
            return;
        }
        if (!token) {
            RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: no token' });
            return;
        }

        // Create API client and SSE connection.
        node.apiClient = new ApiClient({
            ip,
            at: token
        });
        node.apiClient.initSSE();
        let errHintCnt = 1;
        node.apiClient.mountSseFunc({
            onopen() {
                node.log('SSE connection success');
            },
            onerror(err) {
                if (errHintCnt > 0) {
                    // Hint only once.
                    node.warn('SSE connection failed');
                    RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server:' + err.message });
                    errHintCnt--;
                }
            },
            onAddDevice(msg) {
                eventBridge.emit(EVENT_SSE_ON_ADD_DEVICE, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onUpdateDeviceInfo(msg) {
                eventBridge.emit(EVENT_SSE_ON_UPDATE_DEVICE_INFO, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onDeleteDevice(msg) {
                eventBridge.emit(EVENT_SSE_ON_DELETE_DEVICE, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onUpdateDeviceState(msg) {
                eventBridge.emit(EVENT_SSE_ON_UPDATE_DEVICE_STATE, JSON.stringify({ srcNodeId: config.id, msg }));
            },
            onUpdateDeviceOnline(msg) {
                eventBridge.emit(EVENT_SSE_ON_UPDATE_DEVICE_ONLINE, JSON.stringify({ srcNodeId: config.id, msg }));
            }
        });

        node.on('close', (done) => {
            node.apiClient.unmountSseFunc();
            done();
        });
    }

    // Add API server node data to cache.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //          "name": "xxx" - API server node name
    //          "ip": "xxx" - API server node IP
    //          "token": "xxx" - API server node token
    //      }
    RED.httpAdmin.post(API_URL_CACHE_ADD_API_SERVER_NODE, (req, res) => {
        const id = req.body.id;
        const name = req.body.name;
        const ip = req.body.ip;
        const token = req.body.token;

        if (nodeDataCache.has(id)) {
            nodeDataCache.remove(id);
        }
        nodeDataCache.add({
            id,
            name,
            ip,
            token
        });

        res.send({ error: 0, msg: 'success' });
    });

    // Remove API server node data from cache.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //      }
    RED.httpAdmin.post(API_URL_CACHE_REMOVE_API_SERVER_NODE, (req, res) => {
        const id = req.body.id;

        if (nodeDataCache.has(id)) {
            nodeDataCache.remove(id);
        }

        res.send({ error: 0, msg: 'success' });
    });

    // Get bridge info.
    // params:
    //      {
    //          "ip": "xxx" - API server node IP
    //      }
    RED.httpAdmin.post(API_URL_GET_BRIDGE_INFO, (req, res) => {
        const ip = req.body.ip;
        const apiClient = new ApiClient({ ip });
        apiClient.getBridgeInfo()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send({ error: 500, msg: 'getBridgeInfo() error' });
            });
    });

    // Get bridge token.
    // params:
    //      {
    //          "ip": "xxx" - API server node IP
    //      }
    RED.httpAdmin.post(API_URL_GET_BRIDGE_TOKEN, (req, res) => {
        const ip = req.body.ip;
        const apiClient = new ApiClient({ ip });
        apiClient.getBridgeAT({ timeout:300000 })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send({ error: 500, msg: 'getBridgeAT() error' });
            })
    });

    // Test token.
    // params:
    //      {
    //          "ip": "xxx" - API server node IP
    //          "token": "xxx" - API server node token
    //      }
    RED.httpAdmin.post(API_URL_TEST_TOKEN, (req, res) => {
        const ip = req.body.ip;
        const token = req.body.token;
        const apiClient = new ApiClient({ ip, at: token });
        apiClient.getDeviceList()
            .then((data) => {
                if (data.error === 0) {
                    res.send({ error: 0 });
                } else {
                    res.send({ error: -1 });
                }
            })
            .catch((err) => {
                res.send({ error: -1 });
            });
    });

    // Get device list.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //      }
    RED.httpAdmin.post(API_URL_GET_DEVICE_LIST, (req, res) => {
        const id = req.body.id;

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.getDeviceList()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send({ error: 500, msg: 'getDeviceList() error' });
            });
    });

    // Control device.
    // params:
    //      {
    //          "id": "xxx" - API server node ID
    //          "deviceId": "xxx" - device ID
    //          "params": {} - device state params
    //      }
    RED.httpAdmin.post(API_URL_CONTROL_DEVICE, (req, res) => {
        const id = req.body.id;
        const deviceId = req.body.deviceId;
        const params = JSON.parse(req.body.params);

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.updateDeviceState(deviceId, { state: params })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send({ error: 500, msg: 'updateDeviceState() error' });
            });
    });

    // Upload thirdparty device state.
    // params:
    // {
    //     "id": "xxx" - API server node ID
    //     "deviceId": "xxx" - device ID
    //     "thirdPartyDeviceId": "xxx" - thirdparty device ID
    //     "params": {} - device state params
    // }
    RED.httpAdmin.post(API_URL_UPLOAD_THIRDPARTY_DEVICE_STATE, (req, res) => {
        const id = req.body.id;
        const deviceId = req.body.deviceId;
        const thirdPartyDeviceId = req.body.thirdPartyDeviceId;
        const params = JSON.parse(req.body.params);

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.uploadDeviceState({
            serial_number: deviceId,
            third_serial_number: thirdPartyDeviceId,
            params: { state: params }
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send({ error: 500, msg: 'uploadDeviceState() error' });
            });
    });

    // Upload thirdparty device online.
    // params:
    // {
    //     "id": "xxx" - API server node ID
    //     "deviceId": "xxx" - device ID
    //     "thirdPartyDeviceId": "xxx" - thirdParty device ID
    //     "params": {} - online params
    // }
    RED.httpAdmin.post(API_URL_UPLOAD_THIRDPARTY_DEVICE_ONLINE, (req, res) => {
        const id = req.body.id;
        const deviceId = req.body.deviceId;
        const thirdPartyDeviceId = req.body.thirdPartyDeviceId;
        const params = JSON.parse(req.body.params);

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.updateDeviceOnline({
            serial_number: deviceId,
            third_serial_number: thirdPartyDeviceId,
            params
        })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send({ error: 500, msg: 'updateDeviceOnline() error' });
            });
    });

    // Add thirdparty device.
    // params:
    //       {
    //           "id": "xxx" - API server node ID
    //           "params": "xxx" - thirdparty device params
    //       }
    RED.httpAdmin.post(API_URL_ADD_THIRDPARTY_DEVICE, (req, res) => {
        const id = req.body.id;
        const params = JSON.parse(req.body.params);

        const nodeData = nodeDataCache.getNodeData(id);
        const node = RED.nodes.getNode(id);
        let apiClient = null;
        // If cache hit, use cache data. Otherwise use node instance.
        if (nodeData) {
            apiClient = new ApiClient({ ip: nodeData.ip, at: nodeData.token });
        } else {
            if (!node || !node.apiClient) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'api-server: info incomplete' });
                res.send(JSON.stringify({ error: 2000, msg: 'api-server: info incomplete' }));
                return;
            }
            apiClient = node.apiClient;
        }

        apiClient.syncDevices({ devices: params })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.send({ error: 500, msg: 'syncDevices() error' });
            });
    });

    RED.nodes.registerType('api-server', ApiServerNode);
};
