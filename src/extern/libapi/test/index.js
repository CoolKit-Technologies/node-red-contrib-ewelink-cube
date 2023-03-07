"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
// async function getBridgeInfo() {
// 	return await coolkit.bridge.getBridgeInfo({ ip: '192.168.1.115' })
// }
// async function getBridgeAT() {
// 	return await coolkit.bridge.getBridgeAT({ ip: '192.168.1.115' })
// }
// async function getDeviceList() {
// 	return await coolkit.device.getDeviceList()
// }
// async function updateDeviceState() {
// 	return await coolkit.device.updateDeviceState('')
// }
// async function controlSpeaker() {
// 	return await coolkit.hardware.controlSpeaker({
// 		type: 'play_beep',
// 		beep: {
// 			name: 'networkConnected',
// 			volume: 50
// 		}
// 	})
// }
// async function syncThirdDevices() {
// 	const devices: IDevice[] = [{
// 		name: '',
// 		serial_number: '',
// 		manufacturer: '',
// 		model: '',
// 		firmware_version: '',
// 		display_category: ECategory.SWITCH,
// 		capabilities: [],
// 		state: '',
// 		online: true,
// 		tags: ''
// 	}]
// 	return await coolkit.thirdparty.syncDevices({
// 		devices,
// 		version: ''
// 	})
// }
// async function updateThirdDeviceState() {
// 	return await coolkit.thirdparty.updateDeviceState({
// 		serial_number: '',
// 		third_serial_number: '',
// 		params: {},
// 		version: '1'
// 	})
// }
// async function reboot() {
// 	return await coolkit.hardware.rebootBridge()
// }
// async function getBridgeState() {
// 	return await coolkit.ihostApi.getBridgeRuntimeState()
// }
// async function getDebugLog() {
// 	return await coolkit.ihostApi.getDebugLog({
// 		serial_number: '00124b002342d5a7',
// 		type: 'directive_log'
// 	})
// }
// async function getDeviceList() {
// 	return await coolkit.ihostApi.getDeviceList()
// }
// async function getAt() {
// 	return await coolkit.ihostApi.getBridgeAT({ ip: '192.168.1.115', timeout: 5000 })
// }
// async function syncThirdDevices() {
// 	const devices: IThirdpartyDevice[] = [{
// 		name: 'test',
// 		third_serial_number: '111',
// 		manufacturer: 'coolkit',
// 		model: 'coolkit',
// 		firmware_version: '0.1',
// 		display_category: ECategory.SWITCH,
// 		capabilities: [{
// 			capability: ECapability.POWER,
// 			permission: 'readWrite'
// 		}],
// 		state: {},
// 		tags: {},
// 		service_address: 'http://192.168.31.14/'
// 	}]
// 	return await coolkit.ihostApi.syncDevices({
// 		devices,
// 		version: '1'
// 	})
// }
async function run() {
    const ihostApi = new index_1.default.ihostApi({ ip: '192.168.1.115', at: 'aa', debug: true });
    const at = ihostApi.getAt();
    console.log("🚀 ~ file: index.ts:98 ~ run ~ at", at);
    // await ihostApi.getBridgeAT({})
    // await ihostApi.getDeviceList()
    // ihostApi.initSSE();
    // ihostApi.mountSseFunc({
    // 	onopen: (message: MessageEvent) => {
    // 		console.log(message);
    // 	},
    // 	onUpdateDeviceState(message) {
    // 		console.log("🚀 ~ file: index.ts:105 ~ updateDeviceState ~ message", message)
    // 	},
    // 	onerror(message) {
    // 		console.log("🚀 ~ file: index.ts:108 ~ onerror ~ message", message)
    // 	},
    // })
    // await sleep(20)
    try {
        ihostApi.unmountSseFunc();
    }
    catch (error) {
        console.log("🚀 ~ file: index.ts:116 ~ run ~ error", error);
    }
}
run();
async function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, timeout * 1000);
    });
}
