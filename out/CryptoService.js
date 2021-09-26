"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
var crypto_js_1 = __importDefault(require("crypto-js"));
var axios_1 = __importDefault(require("axios"));
var Config_js_1 = require("./Config.js");
var config = new Config_js_1.Config();
var CryptoService = /** @class */ (function () {
    function CryptoService() {
        this._apiKey = config.getApiKey();
        this._apiSecret = config.getApiSecret();
    }
    CryptoService.prototype.sign = function (request) {
        var paramsString = request.params == null
            ? ""
            : Object.keys(request.params)
                .sort()
                .reduce(function (a, b) {
                return a + b + request.params[b];
            }, "");
        var sigPayload = request.method + request.id + this._apiKey + paramsString + request.nonce;
        request.api_key = this._apiKey;
        request.sig = crypto_js_1.default
            .HmacSHA256(sigPayload, this._apiSecret)
            .toString(crypto_js_1.default.enc.Hex);
        return request;
    };
    CryptoService.prototype.getAccountSummary = function (currency) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("https://api.crypto.com/v2/private/get-account-summary", this.sign({
                            id: 1,
                            method: "private/get-account-summary",
                            params: {
                                currency: currency
                            },
                            nonce: Date.now()
                        })).catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data.result.accounts];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CryptoService.prototype.getAllAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("https://api.crypto.com/v2/private/get-account-summary", this.sign({
                            id: 1,
                            method: "private/get-account-summary",
                            params: {},
                            nonce: Date.now()
                        })).catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data.result.accounts];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CryptoService.prototype.getTicker = function (instrument_name) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.crypto.com/v2/public/get-ticker?instrument_name=" + instrument_name).catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data.result.data];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CryptoService.prototype.getAllTickers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.crypto.com/v2/public/get-ticker").catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data.result.data];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CryptoService.prototype.getInstruments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.crypto.com/v2/public/get-instruments").catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data.result.instruments];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CryptoService.prototype.getCoinMK = function (vs_currency, count) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + vs_currency + "&order=market_cap_desc&per_page=" + count + "&page=1&sparkline=false").catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CryptoService.prototype.createMarketSellOrder = function (instrument_name, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("https://api.crypto.com/v2/private/create-order", this.sign({
                            id: 1,
                            method: "private/create-order",
                            params: {
                                instrument_name: instrument_name,
                                side: "SELL",
                                type: "MARKET",
                                quantity: quantity
                            },
                            nonce: Date.now()
                        })).catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data.result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CryptoService.prototype.createMarketBuyOrder = function (instrument_name, notional) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("https://api.crypto.com/v2/private/create-order", this.sign({
                            id: 1,
                            method: "private/create-order",
                            params: {
                                instrument_name: instrument_name,
                                side: "BUY",
                                type: "MARKET",
                                notional: notional
                            },
                            nonce: Date.now()
                        })).catch(function (error) {
                            console.log(error);
                        })];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response.data.result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return CryptoService;
}());
exports.CryptoService = CryptoService;
