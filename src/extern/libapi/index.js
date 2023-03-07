"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECategory = exports.ECapability = void 0;
// import { _bridge, _device, _hardware, _thirdparty } from './api'
const ihostClass_1 = __importDefault(require("./api/ihostClass"));
const nspanelproClass_1 = __importDefault(require("./api/nspanelproClass"));
var ECapability_1 = require("./ts/enum/ECapability");
Object.defineProperty(exports, "ECapability", { enumerable: true, get: function () { return ECapability_1.ECapability; } });
var ECategory_1 = require("./ts/enum/ECategory");
Object.defineProperty(exports, "ECategory", { enumerable: true, get: function () { return ECategory_1.ECategory; } });
// const Api = {
// 	init,
// 	bridge: _bridge,
// 	device: _device,
// 	hardware: _hardware,
// 	thirdparty: _thirdparty,
// }
const Api = {
    ihostApi: ihostClass_1.default,
    nspanelproApi: nspanelproClass_1.default
};
exports.default = Api;
