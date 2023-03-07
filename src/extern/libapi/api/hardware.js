"use strict";
// import store from "../config"
// import EMethod from "../ts/enum/EMethod"
// import EPath from "../ts/enum/EPath"
// import httpRequest from "../utils/httpUtils"
// const _hardware = {
// 	/**
// 	 * 重启网关
// 	 */
// 	async rebootBridge() {
// 		return await httpRequest({ ip: store.config.ip, path: EPath.HARDWARE_REBOOT, method: EMethod.POST })
// 	},
// 	/**
// 	 * 扬声器控制
// 	 */
// 	async controlSpeaker(params: {
// 		type: 'play_sound' | 'play_beep',
// 		sound?: {
// 			name: string,
// 			volume: number,
// 			countdown: number
// 		},
// 		beep?: {
// 			name: string,
// 			volume: number,
// 		}
// 	}) {
// 		return await httpRequest({ ip: store.config.ip, path: EPath.HARDWARE_SPEAKER, method: EMethod.POST, params })
// 	}
// }
// export { _hardware }
