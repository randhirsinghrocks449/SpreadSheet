import config from './config.json';
const mode = "development";
export const server = config[mode];
const envData = config[mode];
export const { serverPath, clientPath } = envData;