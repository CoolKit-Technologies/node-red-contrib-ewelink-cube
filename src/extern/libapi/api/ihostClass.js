"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EMethod_1 = __importDefault(require("../ts/enum/EMethod"));
const EPath_1 = __importDefault(require("../ts/enum/EPath"));
const baseClass_1 = __importDefault(require("./baseClass"));
class ihostClass extends baseClass_1.default {
    constructor(config) {
        super(config);
    }
    /**
     * 获取网关运行状态
     */
    async getBridgeRuntimeState() {
        return await this.httpRequest({ path: EPath_1.default.BRIDGE_RUNTIME, method: EMethod_1.default.GET });
    }
}
exports.default = ihostClass;
