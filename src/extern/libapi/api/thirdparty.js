"use strict";
// import store from "../config"
// import EMethod from "../ts/enum/EMethod"
// import EPath from "../ts/enum/EPath"
// import { IDevice } from "../ts/interface/IDevice"
// import { IThirdRequest } from "../ts/interface/IThirdParty"
// import httpRequest from "../utils/httpUtils"
// import { v4 as uuid } from 'uuid'
// const _thirdparty = {
// 	/**
// 	 * 同步新设备列表
// 	 */
// 	async syncDevices({ devices, version = '1' }: { devices: IDevice[], version?: string }) {
// 		if (version !== '1') return { error: 1000, msg: 'version must be 1', data: {} }
// 		const request: IThirdRequest = {
// 			event: {
// 				header: {
// 					name: 'DiscoveryRequest',
// 					message_id: uuid(),
// 					version
// 				},
// 				payload: {
// 					endpoints: devices
// 				}
// 			}
// 		}
// 		return await httpRequest({ ip: store.config.ip, path: EPath.THIRD_PARTY, method: EMethod.POST, params: request })
// 	},
// 	/**
// 	 * 设备状态更新上报
// 	 */
// 	async updateDeviceState(
// 		{ serial_number, third_serial_number, params, version = '1' }:
// 			{ serial_number: string, third_serial_number: string, params: any, version?: string }) {
// 		if (version !== '1') return { error: 1000, msg: 'version must be 1', data: {} }
// 		const request: IThirdRequest = {
// 			event: {
// 				header: {
// 					name: 'DeviceStatesChangeReport',
// 					message_id: uuid(),
// 					version
// 				},
// 				endpoint: {
// 					serial_number: '',
// 					third_serial_number: ''
// 				},
// 				payload: params
// 			}
// 		}
// 		return await httpRequest({ ip: store.config.ip, path: EPath.THIRD_PARTY, method: EMethod.POST, params: request })
// 	},
// 	/**
// 	 * 设备上下线状态上报
// 	 */
// 	async updateDeviceOnline(
// 		{ serial_number, third_serial_number, params, version = '1' }:
// 			{ serial_number: string, third_serial_number: string, params: any, version?: string }) {
// 		if (version !== '1') return { error: 1000, msg: 'version must be 1', data: {} }
// 		const request: IThirdRequest = {
// 			event: {
// 				header: {
// 					name: 'DeviceOnlineChangeReport',
// 					message_id: uuid(),
// 					version
// 				},
// 				endpoint: {
// 					serial_number,
// 					third_serial_number
// 				},
// 				payload: params
// 			}
// 		}
// 		return await httpRequest({ ip: store.config.ip, path: EPath.THIRD_PARTY, method: EMethod.POST, params: request })
// 	}
// }
// export { _thirdparty }
