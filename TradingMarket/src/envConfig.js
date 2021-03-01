var appType = 2;
const Config = {};
if (appType === 1) {
    //本地开发环境npn
    Config.serverUrl = 'http://localhost:9999/TradingMarket/';
    Config.serverIp = 'http://localhost:3000/';
} else if (appType === 2) {
    //测试环境
    Config.serverUrl = 'http://123.56.106.180:9999/TradingMarket/';
    Config.serverIp = 'http://localhost/';
}else if (appType === 3){
    //生产环境
    Config.serverUrl = 'http://123.56.106.180:9999/TradingMarket/';
    Config.serverIp = 'http://123.56.106.180/';
}else if (appType === 4){
    //发布环境
    Config.serverUrl = 'http://123.56.106.180:9999/TradingMarket/';
    Config.serverIp = 'http://www.hhduan.top/';
}else {
    Config.serverUrl = 'http://localhost:9999/TradingMarket/';
    Config.serverIp = 'http://localhost/';
}
export default Config;