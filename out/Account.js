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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
var Config_js_1 = require("./Config.js");
var CryptoService_js_1 = require("./CryptoService.js");
var Trading_js_1 = require("./Trading.js");
var config = new Config_js_1.Config();
var trading = new Trading_js_1.Trading();
var svc = new CryptoService_js_1.CryptoService();
var Account = /** @class */ (function () {
    function Account() {
        this._indexInstruments = [];
        this._tickers = [];
        this._coinsMK = [];
        this._accounts = [];
        this._instruments = [];
        this._exclStableCoins = config.getExclStableCoins();
        this._inclCoins = config.getInclCoins();
        this._exclCoins = config.getExclCoins();
        this._rebalTreshold = config.getRebalTreshold();
        this._dcaUseMoney = config.getDcaUseMoney();
        this._surplus = 0;
        this._usdtValue = 0;
        this._dcaAmount = 0;
        this._totalValue = 0;
    }
    Account.prototype.getDcaAmount = function () {
        return this._dcaAmount;
    };
    Account.prototype.setDcaAmount = function (dcaAmount) {
        this._dcaAmount = dcaAmount;
    };
    Account.prototype.getSurplus = function () {
        return this._surplus;
    };
    Account.prototype.setSurplus = function (surplus) {
        this._surplus = surplus;
    };
    Account.prototype.getIndexInstruments = function () {
        return this._indexInstruments;
    };
    Account.prototype.setIndexInstruments = function (indexInstruments) {
        this._indexInstruments = indexInstruments;
    };
    Account.prototype.getAccounts = function () {
        return this._accounts;
    };
    Account.prototype.setAccounts = function (accounts) {
        this._accounts = accounts;
    };
    Account.prototype.getTickers = function () {
        return this._tickers;
    };
    Account.prototype.setTickers = function (tickers) {
        this._tickers = tickers;
    };
    Account.prototype.calcIndexInstruments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, mcFrom, mcTo, _loop_1, this_1, _i, _c, c, _loop_2, this_2, i, state_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // 1. Get Coins by market cap
                        _a = this;
                        return [4 /*yield*/, svc.getCoinMK("usd", 100)];
                    case 1:
                        // 1. Get Coins by market cap
                        _a._coinsMK = _d.sent();
                        // Get tickers
                        _b = this;
                        return [4 /*yield*/, svc.getAllTickers()];
                    case 2:
                        // Get tickers
                        _b._tickers = _d.sent();
                        mcFrom = config.getMcFrom();
                        mcTo = config.getMcTo();
                        if (this._coinsMK && this._tickers) {
                            _loop_1 = function (c) {
                                if (this_1._tickers.findIndex(function (obj) { return obj.i == c.toUpperCase() + "_USDT"; }) != -1) { // Check if coin is avalable at crypto.com exchange
                                    var coinIndex = this_1._coinsMK.findIndex(function (obj) { return obj.symbol.toUpperCase() == c.toUpperCase(); }); // get Coin by market cap as it's not allways in order
                                    var coin = this_1._coinsMK[coinIndex];
                                    this_1._indexInstruments.push(coin);
                                    mcTo -= 1;
                                }
                            };
                            this_1 = this;
                            // Add Coins manually included as long as they are available on crypto.com exchange
                            for (_i = 0, _c = this._inclCoins; _i < _c.length; _i++) {
                                c = _c[_i];
                                _loop_1(c);
                            }
                            _loop_2 = function (i) {
                                //for(const coin of this._coinsMK){
                                var coinIndex = this_2._coinsMK.findIndex(function (obj) { return obj.market_cap_rank == i; }); // get Coin by market cap as it's not allways in order
                                var coin = this_2._coinsMK[coinIndex];
                                if (!config.getExclStableCoins().includes(coin.symbol) && !this_2._indexInstruments.includes(coin) && !this_2._exclCoins.includes(coin.symbol)) {
                                    if (coin.market_cap_rank >= mcFrom && coin.market_cap_rank <= mcTo) {
                                        if (this_2._tickers.findIndex(function (obj) { return obj.i == coin.symbol.toUpperCase() + "_USDT"; }) != -1) { // Check if coin is avalable at crypto.com exchange
                                            this_2._indexInstruments.push(coin);
                                        }
                                        else {
                                            mcTo += 1;
                                        }
                                    }
                                    else {
                                        return "break";
                                    }
                                }
                                else {
                                    mcTo += 1;
                                }
                            };
                            this_2 = this;
                            for (i = 1; i < 100; i++) {
                                state_1 = _loop_2(i);
                                if (state_1 === "break")
                                    break;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.calcAllocation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _loop_3, this_3, _i, _b, account, _loop_4, this_4, _c, _d, account;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // Get all accounts
                        _a = this;
                        return [4 /*yield*/, svc.getAllAccounts()];
                    case 1:
                        // Get all accounts
                        _a._accounts = _e.sent();
                        if (this._accounts && this._tickers && this._indexInstruments && this._instruments) {
                            _loop_3 = function (account) {
                                var accountIndex = this_3._accounts.indexOf(account);
                                var tickerIndex = this_3._tickers.findIndex(function (obj) { return obj.i == account.currency.toUpperCase() + "_USDT"; });
                                var coinIndex = this_3._indexInstruments.findIndex(function (obj) { return obj.symbol.toLowerCase() == account.currency.toLowerCase(); });
                                if (tickerIndex != -1) {
                                    this_3._accounts[accountIndex].current_price = this_3._tickers[tickerIndex].k; // The current best bid price, null if there aren't any bids
                                    this_3._accounts[accountIndex].currValue = this_3._tickers[tickerIndex].k * account.balance;
                                    this_3._totalValue += this_3._accounts[accountIndex].currValue;
                                }
                                if (account.currency == 'USDT') {
                                    this_3._usdtValue = account.balance;
                                }
                            };
                            this_3 = this;
                            for (_i = 0, _b = this._accounts; _i < _b.length; _i++) {
                                account = _b[_i];
                                _loop_3(account);
                            }
                            _loop_4 = function (account) {
                                var coinIndex = this_4._indexInstruments.findIndex(function (obj) { return obj.symbol.toLowerCase() == account.currency.toLowerCase(); });
                                if (coinIndex != -1) {
                                    var currAllocation = Math.round(account.currValue / this_4._totalValue * 100 * 1000) / 1000;
                                    var expAllocation = Math.round(100 / (this_4._indexInstruments.length) * 1000) / 1000;
                                    var expValue = this_4._totalValue / 100 * expAllocation;
                                    var instrumentIndex = this_4._instruments.findIndex(function (obj) { return obj.instrument_name == account.currency.toUpperCase() + "_USDT"; });
                                    var accountIndex = this_4._accounts.indexOf(account);
                                    this_4._accounts[accountIndex].currAllocation = currAllocation;
                                    this_4._accounts[accountIndex].expAllocation = expAllocation;
                                    this_4._accounts[accountIndex].expValue = expValue;
                                }
                            };
                            this_4 = this;
                            for (_c = 0, _d = this._accounts; _c < _d.length; _c++) {
                                account = _d[_c];
                                _loop_4(account);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.sellOutOfIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _loop_5, this_5, _i, _b, account;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        //4. Sell Coins which are not in the list
                        _a = this;
                        return [4 /*yield*/, svc.getInstruments()];
                    case 1:
                        //4. Sell Coins which are not in the list
                        _a._instruments = _c.sent();
                        if (!(this._accounts && this._tickers && this._indexInstruments && this._instruments)) return [3 /*break*/, 5];
                        _loop_5 = function (account) {
                            var coinIndex, instrumentIndex;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        coinIndex = this_5._indexInstruments.findIndex(function (obj) { return obj.symbol.toLowerCase() == account.currency.toLowerCase(); });
                                        if (!(coinIndex == -1 && account.currValue > 0.25 && !this_5._exclStableCoins.includes(account.currency.toLowerCase()))) return [3 /*break*/, 2];
                                        console.log("\u001B[1;33m [INDEX]\t" + account.currency + " fell out of index, sell position");
                                        instrumentIndex = this_5._instruments.findIndex(function (obj) { return obj.instrument_name == account.currency.toUpperCase() + "_USDT"; });
                                        return [4 /*yield*/, trading.createMarketSellOrder(this_5._instruments[instrumentIndex], account.balance, account.currValue)];
                                    case 1:
                                        _d.sent();
                                        this_5._surplus += account.current_price * account.balance;
                                        _d.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_5 = this;
                        _i = 0, _b = this._accounts;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 5];
                        account = _b[_i];
                        return [5 /*yield**/, _loop_5(account)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.sellOverperformers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _loop_6, this_6, _i, _b, account;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, svc.getInstruments()];
                    case 1:
                        _a._instruments = _c.sent();
                        if (!(this._accounts && this._indexInstruments && this._instruments)) return [3 /*break*/, 5];
                        _loop_6 = function (account) {
                            var coinIndex, instrumentIndex, sellValue, sellQuantity;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        coinIndex = this_6._indexInstruments.findIndex(function (obj) { return obj.symbol.toLowerCase() == account.currency.toLowerCase(); });
                                        instrumentIndex = this_6._instruments.findIndex(function (obj) { return obj.instrument_name == account.currency.toUpperCase() + "_USDT"; });
                                        if (!(coinIndex != -1)) return [3 /*break*/, 2];
                                        if (!(account.currAllocation > account.expAllocation * (1 + this_6._rebalTreshold / 100))) return [3 /*break*/, 2];
                                        sellValue = account.currValue - account.expValue;
                                        sellQuantity = sellValue / account.current_price;
                                        console.log("[REBALANCE " + account.currency + "]\tSELL " + sellQuantity + "\tat a price of " + account.current_price + "\tTotal " + sellValue.toFixed(3) + " USDT]");
                                        //console.log(`[REBALANCE ${account.currency}] SELL ${sellQuantity} at a price of ${account.current_price} => Total ${sellValue.toFixed(3)} USDT]`);
                                        return [4 /*yield*/, trading.createMarketSellOrder(this_6._instruments[instrumentIndex], sellQuantity, sellValue)];
                                    case 1:
                                        //console.log(`[REBALANCE ${account.currency}] SELL ${sellQuantity} at a price of ${account.current_price} => Total ${sellValue.toFixed(3)} USDT]`);
                                        _d.sent();
                                        this_6._surplus += account.current_price * sellQuantity;
                                        _d.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_6 = this;
                        _i = 0, _b = this._accounts;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 5];
                        account = _b[_i];
                        return [5 /*yield**/, _loop_6(account)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.buyUnderperformers = function (rebalTreshold) {
        return __awaiter(this, void 0, void 0, function () {
            var buyValue, treshold, _a, _loop_7, this_7, _i, _b, account, state_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        buyValue = 0;
                        treshold = this._rebalTreshold;
                        if (rebalTreshold != undefined) {
                            treshold = rebalTreshold;
                        }
                        _a = this;
                        return [4 /*yield*/, svc.getInstruments()];
                    case 1:
                        _a._instruments = _c.sent();
                        if (!(this._accounts && this._indexInstruments && this._instruments && this._tickers)) return [3 /*break*/, 5];
                        _loop_7 = function (account) {
                            var coinIndex, instrumentIndex, tickerIndex, buyQuantity;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        coinIndex = this_7._indexInstruments.findIndex(function (obj) { return obj.symbol.toLowerCase() == account.currency.toLowerCase(); });
                                        if (!(coinIndex != -1)) return [3 /*break*/, 3];
                                        instrumentIndex = this_7._instruments.findIndex(function (obj) { return obj.instrument_name == account.currency.toUpperCase() + "_USDT"; });
                                        tickerIndex = this_7._tickers.findIndex(function (obj) { return obj.i == account.currency.toUpperCase() + "_USDT"; });
                                        if (!(account.currAllocation < account.expAllocation * (1 - treshold / 100))) return [3 /*break*/, 2];
                                        buyValue = account.expValue - account.currValue;
                                        buyQuantity = buyValue / account.current_price;
                                        if (buyValue > this_7._surplus) {
                                            buyValue = this_7._surplus;
                                        }
                                        console.log("[REBALANCE " + account.currency + "]\tBUY " + buyQuantity + "\tat a price of " + account.current_price + "\t[" + buyValue.toFixed(3) + " USDT]");
                                        //   console.log(`[REBALANCE ${account.currency}] BUY ${buyQuantity} at a price of ${account.current_price} [${buyValue.toFixed(3)} USDT]`)
                                        return [4 /*yield*/, trading.createMarketBuyOrder(this_7._instruments[instrumentIndex], buyValue, this_7._tickers[tickerIndex], buyQuantity)];
                                    case 1:
                                        //   console.log(`[REBALANCE ${account.currency}] BUY ${buyQuantity} at a price of ${account.current_price} [${buyValue.toFixed(3)} USDT]`)
                                        _d.sent();
                                        this_7._surplus = this_7._surplus - buyValue;
                                        _d.label = 2;
                                    case 2:
                                        if (this_7._surplus == 0) {
                                            console.log("[REBALANCE]\twas stopped because money limit was reached");
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        _d.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_7 = this;
                        _i = 0, _b = this._accounts;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 5];
                        account = _b[_i];
                        return [5 /*yield**/, _loop_7(account)];
                    case 3:
                        state_2 = _c.sent();
                        if (typeof state_2 === "object")
                            return [2 /*return*/, state_2.value];
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.addMoney = function (dcaAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _loop_8, this_8, _i, _b, account;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, svc.getInstruments()];
                    case 1:
                        _a._instruments = _c.sent();
                        if (!(this._accounts && this._indexInstruments && this._instruments && this._tickers)) return [3 /*break*/, 5];
                        _loop_8 = function (account) {
                            var coinIndex, instrumentIndex, tickerIndex, buyValue, buyQuantity;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        coinIndex = this_8._indexInstruments.findIndex(function (obj) { return obj.symbol.toLowerCase() == account.currency.toLowerCase(); });
                                        if (!(coinIndex != -1)) return [3 /*break*/, 2];
                                        instrumentIndex = this_8._instruments.findIndex(function (obj) { return obj.instrument_name == account.currency.toUpperCase() + "_USDT"; });
                                        tickerIndex = this_8._tickers.findIndex(function (obj) { return obj.i == account.currency.toUpperCase() + "_USDT"; });
                                        buyValue = dcaAmount / this_8._indexInstruments.length;
                                        buyQuantity = buyValue / account.current_price;
                                        console.log("[DCA " + account.currency + "]\tBUY " + buyQuantity + "\tat a price of " + account.current_price + "\t[" + (account.current_price * buyQuantity).toFixed(3) + " USDT]");
                                        return [4 /*yield*/, trading.createMarketBuyOrder(this_8._instruments[instrumentIndex], buyValue, this_8._tickers[tickerIndex], buyQuantity)];
                                    case 1:
                                        _d.sent();
                                        _d.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_8 = this;
                        _i = 0, _b = this._accounts;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 5];
                        account = _b[_i];
                        return [5 /*yield**/, _loop_8(account)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.calcDcaMoney = function () {
        return __awaiter(this, void 0, void 0, function () {
            var today, dayNumber, daysToNewMoney;
            return __generator(this, function (_a) {
                today = new Date;
                dayNumber = today.getDate();
                daysToNewMoney = 0;
                if (dayNumber >= this._dcaUseMoney) {
                    daysToNewMoney = 31 - dayNumber;
                    daysToNewMoney += this._dcaUseMoney;
                }
                else {
                    daysToNewMoney = this._dcaUseMoney - today.getDate();
                }
                this._dcaAmount = this._usdtValue / (daysToNewMoney + 1); // always keep 1 day of money as a reserve
                return [2 /*return*/];
            });
        });
    };
    Account.prototype.logInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_9, this_9, _i, _a, account;
            return __generator(this, function (_b) {
                if (this._accounts) {
                    console.log("\u001B[1;36m[Info]\tTotal invested \t" + this._totalValue + " USD");
                    console.log("\u001B[1;36m[Info]\tUSDT left \t" + this._usdtValue + " USDT");
                    _loop_9 = function (account) {
                        var coinIndex = this_9._indexInstruments.findIndex(function (obj) { return obj.symbol.toLowerCase() == account.currency.toLowerCase(); });
                        if (coinIndex != -1) {
                            console.log("[" + account.currency + "] \tRank " + this_9._indexInstruments[coinIndex].market_cap_rank + "\tCurrent Allocation " + account.currAllocation + "%\t[" + account.currValue.toFixed(3) + " USDT]\texpected Allocation " + account.expAllocation + "%\t[" + account.expValue.toFixed(3) + " USDT]");
                        }
                    };
                    this_9 = this;
                    for (_i = 0, _a = this._accounts; _i < _a.length; _i++) {
                        account = _a[_i];
                        _loop_9(account);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    return Account;
}());
exports.Account = Account;
