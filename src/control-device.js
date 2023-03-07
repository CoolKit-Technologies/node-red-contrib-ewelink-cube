const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const { API_URL_CONTROL_DEVICE,EVENT_NODE_RED_ERROR } = require('./utils/const');
module.exports = function (RED) {
    function ControlDevicesNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input',() => {
            const server = config.server.trim();
            const device = config.device.trim();

            if (!server) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'control-device: no server' });
                return;
            }

            if (!device) {
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: 'control-device: no device' });
                return;
            }
            node.log('config>>>>>>>>>>>>>>>' + JSON.stringify(config));
            const params = JSON.parse(JSON.stringify(config));
            let data = {
                id:config.server,
                deviceId:config.device,
                params:{}
            };
            if(!params.list){
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: `control-device: ${RED._('control-device.message.node_execution_failed')}` });
                return;
            };
            const list = JSON.parse(params.list);
            if (params.device === list.deviceId) {
                switch (list.type) {
                    case 'light':
                        for (const item in list.light) {
                            if (list.light[item]) {
                                if ([item] == 'power') {
                                    data.params.power = { powerState: list.light[item] };
                                } else if ([item] == 'brightness') {
                                    data.params.brightness = { brightness: Number(list.light[item]) };
                                } else if ([item] == 'colorOrTemp') {
                                    if (list.light.type === 'color-temperature') {
                                        let temperature = {
                                            'color-temperature': {
                                                colorTemperature: Number(list.light[item]),
                                            },
                                        };
                                        Object.assign(data.params, temperature);
                                    } else if (list.light.type === 'color-rgb') {
                                        try{
                                            if(list.light.hslStr){
                                                const [red, green, blue] = list.light.hslStr.match(/\d+/g).map(Number);
                                                let rgb = {
                                                    'color-rgb': {
                                                        red,
                                                        green,
                                                        blue
                                                    },
                                                };
                                                Object.assign(data.params, rgb);
                                            }
                                        }catch(error){
                                            console.log('error',error);
                                        }

                                    }
                                }
                            }
                        }
                        break;
                    case 'single':
                        let single = { power: { powerState: list.single } };
                        Object.assign(data.params,single);
                        break;
                    case 'multi':
                        const allOn = Object.values(list.multi).every((item)=>item=='on');
                        const allOff = Object.values(list.multi).every((item)=>item=='off');
                        if(allOn || allOff){
                            let single = { power: { powerState: allOn ? 'on' : 'off' } };
                            Object.assign(data.params,single);
                        }else{
                            data.params.toggle = {};
                            for (const item in list.multi) {
                                let toggle = {
                                    [item]: {
                                        toggleState: list.multi[item],
                                    },
                                };
                                Object.assign(data.params.toggle, toggle);
                            }
                        }
                        break;
                    case 'curtain':
                        let  curtain ={};
                        if(typeof list.curtain === 'string'){
                            curtain = {
                                'motor-control': {
                                    motorControl: list.curtain,
                                }
                            }
                        }else{
                            curtain = { percentage: { percentage: list.curtain } };
                        }
                        Object.assign(data.params,curtain);
                        break;
                    default:
                        break;
                }
            }else{
                RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: `control-device: ${RED._('control-device.message.node_execution_failed')}` });
                return;
            }
            node.log('data---------------------' + JSON.stringify(data));

            data.params=JSON.stringify(data.params);
            axios.post(`http://127.0.0.1:1880${API_URL_CONTROL_DEVICE}`, data)
            .then((res) => {
                // Add status
                if (res.data.error === 0) {
                    node.status({ text: '' });
                } else {
                    node.status({ fill: 'red', shape: 'ring', text: RED._('control-device.message.connect_fail') });
                    RED.comms.publish(EVENT_NODE_RED_ERROR, { msg: `control-device: ${RED._('control-device.message.node_execution_failed')}` });
                }
                node.log('res>>>>>>>>>>>>>>>>>>>'+JSON.stringify(res.data));
                node.send({ payload: res.data });
            })
            .catch((error) => {
                node.error(error);
            });
        });
    }

    RED.nodes.registerType('control-device', ControlDevicesNode);
};
