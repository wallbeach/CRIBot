"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var Config = /** @class */ (function () {
    function Config() {
        this.apiKey = "";
        this.apiSecret = "";
        //    this.apiKey             = "";
        //    this.apiSecret          = "";
        this.exclStableCoins = ["bnb", "usdt", "usdc", "busd", "dai", "ust", "lusd", "pax", "tusd", "fei"]; // Stable coins to hold value on the exchange
        this.exclCoins = ["shib"]; // coins to exclude from the list (apart from stable coins)
        this.inclCoins = ["cro"]; // coins to include in list even if they are out of the market cap range
        this.rebalInterval = 12; // Rebals per day (min. 1, max 24)
        this.rebalTreshold = 5; // Percent
        this.dcaUseMoney = 25; // Use USDT in DCA events until the 25th of each month
        this.mcFrom = 1; // Market cap rank starting    
        this.mcTo = 20; // Market cap rank ending
    }
    Config.prototype.getApiKey = function () {
        return this.apiKey;
    };
    Config.prototype.setApiKey = function (apiKey) {
        this.apiKey = apiKey;
    };
    Config.prototype.getApiSecret = function () {
        return this.apiSecret;
    };
    Config.prototype.setApiSecret = function (apiSecret) {
        this.apiSecret = apiSecret;
    };
    Config.prototype.getInclCoins = function () {
        return this.inclCoins;
    };
    Config.prototype.setInclCoins = function (inclCoins) {
        this.inclCoins = inclCoins;
    };
    Config.prototype.getExclCoins = function () {
        return this.exclCoins;
    };
    Config.prototype.setExclCoins = function (exclCoins) {
        this.exclCoins = exclCoins;
    };
    Config.prototype.getExclStableCoins = function () {
        return this.exclStableCoins;
    };
    Config.prototype.setExclStableCoins = function (exclStableCoins) {
        this.exclStableCoins = exclStableCoins;
    };
    Config.prototype.getRebalInterval = function () {
        return this.rebalInterval;
    };
    Config.prototype.setRebalInterval = function (rebalInterval) {
        this.rebalInterval = rebalInterval;
    };
    Config.prototype.getRebalTreshold = function () {
        return this.rebalTreshold;
    };
    Config.prototype.setRebalTreshold = function (rebalTreshold) {
        this.rebalTreshold = rebalTreshold;
    };
    Config.prototype.getDcaUseMoney = function () {
        return this.dcaUseMoney;
    };
    Config.prototype.setDcaUseMoney = function (dcaUseMoney) {
        this.dcaUseMoney = dcaUseMoney;
    };
    Config.prototype.getMcFrom = function () {
        return this.mcFrom;
    };
    Config.prototype.setMcFrom = function (mcFrom) {
        this.mcFrom = mcFrom;
    };
    Config.prototype.getMcTo = function () {
        return this.mcTo;
    };
    Config.prototype.setMcTo = function (mcTo) {
        this.mcTo = mcTo;
    };
    return Config;
}());
exports.Config = Config;
