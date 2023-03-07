import IConfig from "../ts/interface/IConfig";
declare class Store {
    config: IConfig;
    setConfig({ debug }: {
        debug?: boolean;
    }): void;
    setIp(ip: string): void;
    setAT(at: string): void;
    setMac(mac: string): void;
}
declare const store: Store;
export default store;
