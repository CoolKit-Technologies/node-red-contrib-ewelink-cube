"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const EPath_1 = __importDefault(require("../ts/enum/EPath"));
const config_1 = __importDefault(require("../config"));
const EMethod_1 = __importDefault(require("../ts/enum/EMethod"));
async function httpRequest(httpConfig) {
    const { path, method, isNeedAT = true, params = {} } = httpConfig;
    const ip = '';
    if (!ip) {
        return { error: 1000, msg: 'ip is needed', data: {} };
    }
    if (!config_1.default.config.at && isNeedAT) {
        return { error: 1000, msg: 'at is needed', data: {} };
    }
    const url = `http://${ip}${EPath_1.default.ROOT}${EPath_1.default.V1}${path}`;
    const headers = {
        'Content-Type': 'application/json'
    };
    if (isNeedAT) {
        Object.assign(headers, {
            'Authorization': `Bearer ${config_1.default.config.at}`
        });
    }
    const config = {
        url,
        method,
        headers,
        timeout: 5000
    };
    if (Object.keys(params).length) {
        if (method === EMethod_1.default.GET || method === EMethod_1.default.DELETE) {
            config.params = params;
        }
        else {
            config.data = params;
        }
    }
    config_1.default.config.debug && console.log('http request body---->', JSON.stringify(config));
    try {
        const resp = await (0, axios_1.default)(config);
        config_1.default.config.debug && console.log('http response body---->', JSON.stringify(resp.data));
        return resp.data;
    }
    catch (error) {
        return { error: 1000, msg: 'http request catch error', data: error };
    }
    // return { error: 1000, msg: 'http request catch error', data: '' }
}
exports.default = httpRequest;
