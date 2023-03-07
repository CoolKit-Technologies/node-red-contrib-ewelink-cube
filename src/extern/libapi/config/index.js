"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    config = {
        ip: '192.168.1.115',
        at: '9775924e-2b6f-4616-a68b-c555a1ae0ad8',
        mac: '',
        debug: false,
    };
    setConfig({ debug = false }) {
        this.config.debug = debug;
    }
    setIp(ip) {
        this.config.ip = ip;
    }
    setAT(at) {
        this.config.at = at;
    }
    setMac(mac) {
        this.config.mac = mac;
    }
}
const store = new Store();
exports.default = store;
