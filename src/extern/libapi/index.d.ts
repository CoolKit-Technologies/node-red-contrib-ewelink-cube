import ihostClass from './api/ihostClass';
import nspanelproClass from './api/nspanelproClass';
export { IDevice } from './ts/interface/IDevice';
export { ECapability } from './ts/enum/ECapability';
export { ECategory } from './ts/enum/ECategory';
export { IThirdpartyDevice } from './ts/interface/IThirdpartyDevice';
declare const Api: {
    ihostApi: typeof ihostClass;
    nspanelproApi: typeof nspanelproClass;
};
export default Api;
