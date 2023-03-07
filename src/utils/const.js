/**
 * API server node - API prefix
 */
const API_PREFIX = 'ewelink-cube-api-v1';

/**
 * API URL - cache - add API server node
 */
const API_URL_CACHE_ADD_API_SERVER_NODE = `/${API_PREFIX}/cache/add-api-server-node`;

/**
 * API URL - cache - remove API server node
 */
const API_URL_CACHE_REMOVE_API_SERVER_NODE = `/${API_PREFIX}/cache/remove-api-server-node`;

/**
 * API URL - get bridge info
 */
const API_URL_GET_BRIDGE_INFO = `/${API_PREFIX}/get-bridge-info`;

/**
 * API URL - get bridge token
 */
const API_URL_GET_BRIDGE_TOKEN = `/${API_PREFIX}/get-bridge-token`;

/**
 * API URL - get device list
 */
const API_URL_GET_DEVICE_LIST = `/${API_PREFIX}/get-device-list`;

/**
 * API URL - control device
 */
const API_URL_CONTROL_DEVICE = `/${API_PREFIX}/control-device`;

/**
 * API URL - test token
 */
const API_URL_TEST_TOKEN = `/${API_PREFIX}/test-token`;

/**
 * API URL - upload thirdparty device state
 */
const API_URL_UPLOAD_THIRDPARTY_DEVICE_STATE = `/${API_PREFIX}/upload-thirdparty-device-state`;

/**
 * API URL - upload thirdparty device online
 */
const API_URL_UPLOAD_THIRDPARTY_DEVICE_ONLINE = `/${API_PREFIX}/upload-thirdparty-device-online`;

/**
 * API URL - add third party device
 */
const API_URL_ADD_THIRDPARTY_DEVICE = `/${API_PREFIX}/add-thirdparty-device`;

/**
 * API URL - ihost callback
 */
const API_URL_IHOST_CALLBACK = `/${API_PREFIX}/ihost-callback`;

/**
 * SSE event - onAddDevice
 */
const EVENT_SSE_ON_ADD_DEVICE = 'EVENT_SSE_ON_ADD_DEVICE';

/**
 * SSE event - onUpdateDeviceInfo
 */
const EVENT_SSE_ON_UPDATE_DEVICE_INFO = 'EVENT_SSE_ON_UPDATE_DEVICE_INFO';

/**
 * SSE event - onDeleteDevice
 */
const EVENT_SSE_ON_DELETE_DEVICE = 'EVENT_SSE_ON_DELETE_DEVICE';

/**
 * SSE event - onUpdateDeviceState
 */
const EVENT_SSE_ON_UPDATE_DEVICE_STATE = 'EVENT_SSE_ON_UPDATE_DEVICE_STATE';

/**
 * SSE event - onUpdateDeviceOnline
 */
const EVENT_SSE_ON_UPDATE_DEVICE_ONLINE = 'EVENT_SSE_ON_UPDATE_DEVICE_ONLINE';

/**
 * Node-RED error event
 */
const EVENT_NODE_RED_ERROR = 'EVENT_NODE_RED_ERROR';

/**
 * Register device node tag item - current api server node ID
 */
const TAG_API_SERVER_NODE_ID = '__api_server_node_id';

/**
 * Register device node tag item - current register device node ID
 */
const TAG_REG_DEV_NODE_ID = '__reg_dev_node_id';

/**
 * Register device node tag item - device id
 */
const TAG_THIRDPARTY_DEVICE_ID = '__thirdparty_device_id';

/**
 * Capabilities map
 */
const CAPA_MAP = [
    {
        capability: 'power',
        permission: 'readWrite'
    },
    {
        capability: 'toggle',
        permission: 'readWrite'
    },
    {
        capability: 'brightness',
        permission: 'readWrite'
    },
    {
        capability: 'color-temperature',
        permission: 'readWrite'
    },
    {
        capability: 'color-rgb',
        permission: 'readWrite'
    },
    {
        capability: 'percentage',
        permission: 'readWrite'
    },
    {
        capability: 'motor-control',
        permission: 'readWrite'
    },
    {
        capability: 'motor-reverse',
        permission: 'read'
    },
    {
        capability: 'motor-clb',
        permission: 'read'
    },
    {
        capability: 'detect',
        permission: 'read'
    },
    {
        capability: 'battery',
        permission: 'read'
    },
    {
        capability: 'press',
        permission: 'read'
    },
    {
        capability: 'rssi',
        permission: 'read'
    },
    {
        capability: 'humidity',
        permission: 'read'
    },
    {
        capability: 'temperature',
        permission: 'read'
    }
];

module.exports = {
    API_PREFIX,
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
    API_URL_IHOST_CALLBACK,
    EVENT_SSE_ON_ADD_DEVICE,
    EVENT_SSE_ON_DELETE_DEVICE,
    EVENT_SSE_ON_UPDATE_DEVICE_INFO,
    EVENT_SSE_ON_UPDATE_DEVICE_ONLINE,
    EVENT_SSE_ON_UPDATE_DEVICE_STATE,
    EVENT_NODE_RED_ERROR,
    TAG_API_SERVER_NODE_ID,
    TAG_REG_DEV_NODE_ID,
    TAG_THIRDPARTY_DEVICE_ID,
    CAPA_MAP
};
