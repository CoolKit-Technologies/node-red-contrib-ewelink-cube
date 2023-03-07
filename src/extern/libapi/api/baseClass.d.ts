/// <reference types="node" />
import EventSource from 'eventsource';
import IDebugLog from "../ts/interface/IDebugLog";
import { IThirdpartyDevice } from "../ts/interface/IThirdpartyDevice";
import IHttpConfig from "../ts/interface/IHttpConfig";
import IResponse from "../ts/interface/IResponse";
import ISseEvent from '../ts/interface/ISseEvent';
export default abstract class baseClass {
    private ip;
    private at;
    private debug;
    interval: NodeJS.Timer | null;
    timeout: NodeJS.Timeout | null;
    time: number;
    event: EventSource | null;
    constructor({ ip, at, debug }: {
        ip: string;
        at?: string;
        debug?: boolean;
    });
    setIp(ip: string): void;
    getIp(): string;
    setAT(at: string): void;
    getAt(): string;
    /**
     * 获取网关访问凭证
     */
    getBridgeAT({ timeout, interval }: {
        timeout?: number;
        interval?: number;
    }): Promise<unknown>;
    private getBridgeATHandler;
    /**
     * 修改网关设置
     */
    updateBridgeConfig(volume: number): Promise<IResponse>;
    /**
     * 获取网关信息
     */
    getBridgeInfo(): Promise<IResponse>;
    /**
     * 重启网关
     */
    rebootBridge(): Promise<IResponse>;
    /**
     * 扬声器控制
     */
    controlSpeaker(params: {
        type: 'play_sound' | 'play_beep';
        sound?: {
            name: string;
            volume: number;
            countdown: number;
        };
        beep?: {
            name: string;
            volume: number;
        };
    }): Promise<IResponse>;
    /**
     * 搜索子设备
     */
    discoverySubDevices(params: {
        enable: boolean;
        type: string;
    }): Promise<IResponse>;
    /**
     * 手动添加子设备 (目前仅支持添加RTSP摄像头和ESP32摄像头)
     */
    manualAddSubDevice(params: {
        name: string;
        display_category: 'camera';
        capabilities: [];
        protocol: 'RTSP' | 'ESP32-CAM';
        manufacturer: string;
        model: string;
        firmware_version: string;
    }): Promise<IResponse>;
    /**
     * 获取设备列表
     */
    getDeviceList(): Promise<IResponse>;
    /**
     * 更新指定设备信息或状态
     */
    updateDeviceState(serial_number: string, updateParams?: {
        name?: string;
        tags?: any;
        state?: any;
        configuration?: any;
    }): Promise<IResponse>;
    /**
     * 删除子设备
     */
    deleteDevice(serial_number: string): Promise<IResponse>;
    /**
     * 同步新设备列表
     */
    syncDevices({ devices, version }: {
        devices: IThirdpartyDevice[];
        version?: string;
    }): Promise<IResponse>;
    /**
     * 设备状态更新上报
     */
    uploadDeviceState({ serial_number, third_serial_number, params, version }: {
        serial_number: string;
        third_serial_number: string;
        params: any;
        version?: string;
    }): Promise<IResponse>;
    /**
     * 设备上下线状态上报
     */
    updateDeviceOnline({ serial_number, third_serial_number, params, version }: {
        serial_number: string;
        third_serial_number: string;
        params: any;
        version?: string;
    }): Promise<IResponse>;
    /**
     * 获取调试日志接口
     */
    getDebugLog({ serial_number, ...params }: IDebugLog): Promise<IResponse>;
    protected httpRequest(httpConfig: IHttpConfig): Promise<IResponse>;
    /**
     * 初始化 sse 连接
     */
    initSSE(): Promise<{
        error: number;
        msg: string;
        data: {};
    } | undefined>;
    mountSseFunc(handler: ISseEvent): {
        error: number;
        msg: string;
        data: {};
    } | undefined;
    unmountSseFunc(): void;
}
