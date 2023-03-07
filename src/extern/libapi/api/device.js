"use strict";
// import store from "../config"
// import EMethod from "../ts/enum/EMethod"
// import EPath from "../ts/enum/EPath"
// import httpRequest from "../utils/httpUtils"
// const _device = {
// 	/**
// 	 * 搜索子设备
// 	 */
// 	async discoverySubDevices(params: {
// 		enable: boolean,
// 		type: string
// 	}) {
// 		return await httpRequest({
// 			ip: store.config.ip,
// 			path: EPath.DEVICE_DISCOVERY,
// 			method: EMethod.PUT,
// 			params
// 		})
// 	},
// 	/**
// 	 * 手动添加子设备 (目前仅支持添加RTSP摄像头和ESP32摄像头)
// 	 */
// 	async manualAddSubDevice(params: {
// 		name: string,
// 		display_category: 'camera',
// 		capabilities: [],
// 		protocol: 'RTSP' | 'ESP32-CAM',
// 		manufacturer: string,
// 		model: string,
// 		firmware_version: string
// 	}) {
// 		return await httpRequest({ ip: store.config.ip, path: EPath.DEVICE, method: EMethod.POST, params })
// 	},
// 	/**
// 	 * 获取设备列表
// 	 */
// 	async getDeviceList() {
// 		return await httpRequest({ ip: store.config.ip, path: EPath.DEVICE, method: EMethod.GET })
// 	},
// 	/**
// 	 * 更新指定设备信息或状态
// 	 */
// 	async updateDeviceState(serial_number: string, updateParams?: {
// 		name?: string,
// 		tags?: any,
// 		state?: any,
// 		configuration?: any
// 	}) {
// 		return await httpRequest({
// 			ip: store.config.ip,
// 			path: `${EPath.DEVICE}/${serial_number}`,
// 			method: EMethod.PUT,
// 			params: { ...updateParams }
// 		})
// 	},
// 	/**
// 	 * 删除子设备
// 	 */
// 	async deleteDevice(serial_number: string) {
// 		return await httpRequest({
// 			ip: store.config.ip,
// 			path: `${EPath.DEVICE}/${serial_number}`,
// 			method: EMethod.DELETE
// 		})
// 	}
// }
// export { _device }
