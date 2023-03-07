import baseClass from "./baseClass";
export default class ihostClass extends baseClass {
    constructor(config: {
        ip: string;
        at?: string;
        debug?: boolean;
    });
    /**
     * 获取网关运行状态
     */
    getBridgeRuntimeState(): Promise<import("../ts/interface/IResponse").default>;
}
