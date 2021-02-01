var appType = 1;
const Config = {};
if (appType === 1) {
    //本地开发环境
    Config.serverUrl = 'http://localhost:9001/secondary/';
    Config.serverIp = 'localhost:3000/';
} else if (appType === 2) {
    //测试环境
    Config.serverUrl = 'http://localhost:9001/secondary/';
    Config.serverIp = 'http://localhost:3000/';
}else if (appType === 3){
    //生产环境
    Config.serverUrl = 'http://localhost.com:9001/secondary/';
    Config.serverIp = 'http://localhost.com/';
}else {
    Config.serverUrl = 'http://localhost:9001/secondary/';
    Config.serverIp = 'http://localhost.com/';
}
export default Config;