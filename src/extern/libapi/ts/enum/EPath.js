"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EPath;
(function (EPath) {
    EPath["ROOT"] = "/open-api";
    EPath["V1"] = "/v1/rest";
    EPath["SSE"] = "/v1/sse/bridge";
    //	bridge module
    EPath["BRIDGE"] = "/bridge";
    EPath["BRIDGE_TOKEN"] = "/bridge/access_token";
    EPath["BRIDGE_RUNTIME"] = "/bridge/runtime";
    EPath["BRIDGE_CONFIG"] = "/bridge/config";
    //	hardware module
    EPath["HARDWARE_REBOOT"] = "/hardware/reboot";
    EPath["HARDWARE_SPEAKER"] = "/hardware/speaker";
    //	device module
    EPath["DEVICE_DISCOVERY"] = "/devices/discovery";
    EPath["DEVICE"] = "/devices";
    //	third-party
    EPath["THIRD_PARTY"] = "/thirdparty/event";
    //	debug-log
    EPath["DEBUG_LOG"] = "/thirdparty/debug-log";
})(EPath || (EPath = {}));
exports.default = EPath;
