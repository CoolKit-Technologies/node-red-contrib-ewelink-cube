"use strict";
// import store from "../config"
// import EMethod from "../ts/enum/EMethod"
// import EPath from "../ts/enum/EPath"
// import httpRequest from "../utils/httpUtils"
// const _bridge = {
// 	/**
// 	 * 获取网关信息
// 	 */
// 	async getBridgeInfo({ ip }: { ip: string }) {
// 		//	set ip
// 		ip && store.setIp(ip)
// 		const resp = await httpRequest({ ip, path: EPath.BRIDGE, method: EMethod.GET, isNeedAT: false })
// 		if (resp.error === 0 && resp.data.mac) {
// 			//	set mac
// 			store.setMac(resp.data.mac)
// 		}
// 		return resp
// 	},
// 	/**
// 	 * 获取网关访问凭证
// 	 */
// 	async getBridgeAT({ ip, timeout = 120000, interval = 2000 }: { ip: string, timeout?: number, interval?: number }) {
// 		//	set ip
// 		ip && store.setIp(ip)
// 		const resp = await httpRequest({ ip, path: EPath.BRIDGE_TOKEN, method: EMethod.GET, isNeedAT: false })
// 		if (resp.error === 0 && resp.data.token && !store.config.at) {
// 			//	set at
// 			store.setAT(resp.data.token)
// 		}
// 		return resp
// 	},
// 	/**
// 	 * 修改网关设置
// 	 */
// 	async updateBridgeConfig(volume: number) {
// 		return await httpRequest({ ip: store.config.ip, path: EPath.BRIDGE_CONFIG, method: EMethod.PUT, params: { volume } })
// 	}
// }
// export { _bridge }
