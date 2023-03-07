declare enum EPath {
    ROOT = "/open-api",
    V1 = "/v1/rest",
    SSE = "/v1/sse/bridge",
    BRIDGE = "/bridge",
    BRIDGE_TOKEN = "/bridge/access_token",
    BRIDGE_RUNTIME = "/bridge/runtime",
    BRIDGE_CONFIG = "/bridge/config",
    HARDWARE_REBOOT = "/hardware/reboot",
    HARDWARE_SPEAKER = "/hardware/speaker",
    DEVICE_DISCOVERY = "/devices/discovery",
    DEVICE = "/devices",
    THIRD_PARTY = "/thirdparty/event",
    DEBUG_LOG = "/thirdparty/debug-log"
}
export default EPath;
