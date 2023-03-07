"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const eventsource_1 = __importDefault(require("eventsource"));
const EMethod_1 = __importDefault(require("../ts/enum/EMethod"));
const EPath_1 = __importDefault(require("../ts/enum/EPath"));
class baseClass {
    ip = '';
    at = '';
    debug = false;
    interval = null;
    timeout = null;
    time = new Date().getTime();
    event = null;
    constructor({ ip, at = '', debug = false }) {
        this.ip = ip;
        this.at = at;
        this.debug = debug;
    }
    setIp(ip) {
        this.ip = ip;
    }
    getIp() {
        return this.ip;
    }
    setAT(at) {
        this.at = at;
    }
    getAt() {
        return this.at;
    }
    /**
     * 获取网关访问凭证
     */
    async getBridgeAT({ timeout = 120000, interval = 2000 }) {
        return new Promise(async (resolve) => {
            //	start interval
            //	nspanelpro first request maybe get response
            const resp = await this.getBridgeATHandler();
            resp && resolve(resp);
            this.interval = setInterval(async () => {
                const resp = await this.getBridgeATHandler();
                if (resp) {
                    this.interval && clearInterval(this.interval);
                    this.timeout && clearTimeout(this.timeout);
                    resolve(resp);
                }
            }, interval);
            this.timeout = setTimeout(() => {
                this.interval && clearInterval(this.interval);
                this.timeout && clearTimeout(this.timeout);
                resolve({ error: 1000, msg: 'timeout', data: {} });
            }, timeout);
        });
    }
    async getBridgeATHandler() {
        // console.log('----->', new Date().getTime() - this.time);
        const resp = await this.httpRequest({ path: EPath_1.default.BRIDGE_TOKEN, method: EMethod_1.default.GET, isNeedAT: false });
        if (resp.error === 0) {
            this.interval && clearInterval(this.interval);
            //	set at
            resp.data.token && this.setAT(resp.data.token);
            return resp;
        }
    }
    /**
     * 修改网关设置
     */
    async updateBridgeConfig(volume) {
        return await this.httpRequest({ path: EPath_1.default.BRIDGE_CONFIG, method: EMethod_1.default.PUT, params: { volume } });
    }
    /**
     * 获取网关信息
     */
    async getBridgeInfo() {
        const resp = await this.httpRequest({ path: EPath_1.default.BRIDGE, method: EMethod_1.default.GET, isNeedAT: false });
        // if (resp.error === 0 && resp.data.mac) {
        // 	//	set mac
        // 	store.setMac(resp.data.mac)
        // }
        return resp;
    }
    /**
     * 重启网关
     */
    async rebootBridge() {
        return await this.httpRequest({ path: EPath_1.default.HARDWARE_REBOOT, method: EMethod_1.default.POST });
    }
    /**
     * 扬声器控制
     */
    async controlSpeaker(params) {
        return await this.httpRequest({ path: EPath_1.default.HARDWARE_SPEAKER, method: EMethod_1.default.POST, params });
    }
    /**
     * 搜索子设备
     */
    async discoverySubDevices(params) {
        return await this.httpRequest({
            path: EPath_1.default.DEVICE_DISCOVERY,
            method: EMethod_1.default.PUT,
            params
        });
    }
    /**
     * 手动添加子设备 (目前仅支持添加RTSP摄像头和ESP32摄像头)
     */
    async manualAddSubDevice(params) {
        return await this.httpRequest({ path: EPath_1.default.DEVICE, method: EMethod_1.default.POST, params });
    }
    /**
     * 获取设备列表
     */
    async getDeviceList() {
        return await this.httpRequest({ path: EPath_1.default.DEVICE, method: EMethod_1.default.GET });
    }
    /**
     * 更新指定设备信息或状态
     */
    async updateDeviceState(serial_number, updateParams) {
        return await this.httpRequest({
            path: `${EPath_1.default.DEVICE}/${serial_number}`,
            method: EMethod_1.default.PUT,
            params: { ...updateParams }
        });
    }
    /**
     * 删除子设备
     */
    async deleteDevice(serial_number) {
        return await this.httpRequest({
            path: `${EPath_1.default.DEVICE}/${serial_number}`,
            method: EMethod_1.default.DELETE
        });
    }
    /**
     * 同步新设备列表
     */
    async syncDevices({ devices, version = '1' }) {
        if (version !== '1')
            return { error: 1000, msg: 'version must be 1', data: {} };
        const request = {
            event: {
                header: {
                    name: 'DiscoveryRequest',
                    message_id: (0, uuid_1.v4)(),
                    version
                },
                payload: {
                    endpoints: devices
                }
            }
        };
        return await this.httpRequest({ path: EPath_1.default.THIRD_PARTY, method: EMethod_1.default.POST, params: request });
    }
    /**
     * 设备状态更新上报
     */
    async uploadDeviceState({ serial_number, third_serial_number, params, version = '1' }) {
        if (version !== '1')
            return { error: 1000, msg: 'version must be 1', data: {} };
        const request = {
            event: {
                header: {
                    name: 'DeviceStatesChangeReport',
                    message_id: (0, uuid_1.v4)(),
                    version
                },
                endpoint: {
                    serial_number,
                    third_serial_number
                },
                payload: params
            }
        };
        return await this.httpRequest({ path: EPath_1.default.THIRD_PARTY, method: EMethod_1.default.POST, params: request });
    }
    /**
     * 设备上下线状态上报
     */
    async updateDeviceOnline({ serial_number, third_serial_number, params, version = '1' }) {
        if (version !== '1')
            return { error: 1000, msg: 'version must be 1', data: {} };
        const request = {
            event: {
                header: {
                    name: 'DeviceOnlineChangeReport',
                    message_id: (0, uuid_1.v4)(),
                    version
                },
                endpoint: {
                    serial_number,
                    third_serial_number
                },
                payload: params
            }
        };
        return await this.httpRequest({ path: EPath_1.default.THIRD_PARTY, method: EMethod_1.default.POST, params: request });
    }
    /**
     * 获取调试日志接口
     */
    async getDebugLog({ serial_number, ...params }) {
        return await this.httpRequest({ path: `${EPath_1.default.DEBUG_LOG}/${serial_number}`, method: EMethod_1.default.GET, params });
    }
    async httpRequest(httpConfig) {
        const { path, method, isNeedAT = true, params = {} } = httpConfig;
        if (!this.ip) {
            return { error: 1000, msg: 'ip is needed', data: {} };
        }
        if (!this.at && isNeedAT) {
            return { error: 1000, msg: 'at is needed', data: {} };
        }
        const url = `http://${this.ip}${EPath_1.default.ROOT}${EPath_1.default.V1}${path}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        if (isNeedAT) {
            Object.assign(headers, {
                'Authorization': `Bearer ${this.at}`
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
        this.debug && console.log('http request body---->', JSON.stringify(config));
        try {
            const resp = await (0, axios_1.default)(config);
            this.debug && console.log('http response body---->', JSON.stringify(resp.data));
            return resp.data;
        }
        catch (error) {
            return { error: 1000, msg: 'http request catch error', data: error };
        }
        // return { error: 1000, msg: 'http request catch error', data: '' }
    }
    /**
     * 初始化 sse 连接
     */
    async initSSE() {
        if (!this.ip) {
            return { error: 1000, msg: 'ip is needed', data: {} };
        }
        if (!this.at) {
            return { error: 1000, msg: 'at is needed', data: {} };
        }
        const url = `http://${this.ip}${EPath_1.default.ROOT}${EPath_1.default.SSE}?access_token=${this.at}`;
        console.log("🚀 ~ file: baseClass.ts:320 ~ baseClass ~ initSSE ~ url", url);
        try {
            this.event = new eventsource_1.default(url);
        }
        catch (error) {
            console.log("🚀 ~ file: baseClass.ts:323 ~ baseClass ~ initSSE ~ error", error);
        }
    }
    mountSseFunc(handler) {
        if (!this.event)
            return { error: 1000, msg: 'must be invoke initSSE first', data: {} };
        handler.onopen && (this.event.onopen = handler.onopen);
        handler.onerror && (this.event.onerror = handler.onerror);
        handler.onAddDevice && this.event.addEventListener('device#v1#addDevice', handler.onAddDevice);
        handler.onUpdateDeviceState && this.event.addEventListener('device#v1#updateDeviceState', handler.onUpdateDeviceState);
        handler.onUpdateDeviceInfo && this.event.addEventListener('device#v1#updateDeviceInfo', handler.onUpdateDeviceInfo);
        handler.onUpdateDeviceOnline && this.event.addEventListener('device#v1#updateDeviceOnline', handler.onUpdateDeviceOnline);
        handler.onDeleteDevice && this.event.addEventListener('device#v1#deleteDevice', handler.onDeleteDevice);
    }
    unmountSseFunc() {
        this.event?.removeEventListener('device#v1#addDevice', () => { });
        this.event?.removeEventListener('device#v1#updateDeviceState', () => { });
        this.event?.removeEventListener('device#v1#updateDeviceInfo', () => { });
        this.event?.removeEventListener('device#v1#updateDeviceOnline', () => { });
        this.event?.removeEventListener('device#v1#deleteDevice', () => { });
        this.event?.close();
    }
}
exports.default = baseClass;
