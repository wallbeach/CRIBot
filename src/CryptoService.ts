import crypto from "crypto-js";
import { IAccount, IOrder, ITrade, ICoin, ITicker, IInstrument } from "./Interface";
import { Config } from './Config.js';

const config = new Config();

export class CryptoService {

    _apiKey: string;
    _apiSecret: string;

    constructor(){

        this._apiKey    = config.getApiKey();
        this._apiSecret = config.getApiSecret();
    }

    public sign(request: any) {
        const paramsString =
            request.params == null
                ? ""
                : Object.keys(request.params)
                    .sort()
                    .reduce((a, b) => {
                        return a + b + request.params[b];
                    }, "");

        const sigPayload = request.method + request.id + this._apiKey + paramsString + request.nonce;

        request.api_key = this._apiKey;
        request.sig = crypto
            .HmacSHA256(sigPayload, this._apiSecret)
            .toString(crypto.enc.Hex);

        return request;
    }

    public async getAccountSummary(currency: string): Promise<IAccount[] | undefined> {
        const response = await axios.post(
            "https://api.crypto.com/v2/private/get-account-summary",
            this.sign({
                id: 1,
                method: "private/get-account-summary",
                params: {
                    currency: currency
                },
                nonce: Date.now()
            })
        ).catch((error) => {
            console.log(error);
        })

        if (response) {
            return response.data.result.accounts;
        }
    }

    public async getAllAccounts(): Promise<IAccount[] | undefined> {
        const response = await axios.post(
            "https://api.crypto.com/v2/private/get-account-summary",
            this.sign({
                id: 1,
                method: "private/get-account-summary",
                params: {
                },
                nonce: Date.now()
            })
        ).catch((error) => {
            console.log(error);
        })

        if (response) {
            return response.data.result.accounts;
        }
    }

    public async getTicker(instrument_name: string): Promise<ITicker | undefined> {
        const response = await axios.get(
            `https://api.crypto.com/v2/public/get-ticker?instrument_name=${instrument_name}`
            
        ).catch((error) => {
            console.log(error);
        })

        if (response){
            return response.data.result.data;
        }

    }

    public async getAllTickers(): Promise<ITicker[] | undefined> {
        const response = await axios.get(
            `https://api.crypto.com/v2/public/get-ticker`
            
        ).catch((error) => {
            console.log(error);
        })

        if (response){
            return response.data.result.data;
        }

    }

    public async getInstruments(): Promise<IInstrument[] | undefined> {
        const response = await axios.get(
            `https://api.crypto.com/v2/public/get-instruments`
            
        ).catch((error) => {
            console.log(error);
        })

        if (response){
            return response.data.result.instruments;
        }

    }

    public async getCoinMK(vs_currency: string, count: number): Promise<ICoin[] | undefined> {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`
            
        ).catch((error) => {
            console.log(error);
        })

        if (response){
            return response.data;
        }

    }

    public async createMarketSellOrder(instrument_name: string, quantity: number): Promise<IOrder[] | undefined> {
        const response = await axios.post(
            "https://api.crypto.com/v2/private/create-order",
            this.sign({
                id: 1,
                method: "private/create-order",
                params: {
                    instrument_name:    instrument_name,
                    side:               "SELL",
                    type:               "MARKET",
                    quantity:           quantity
                },
                nonce: Date.now()
            })
        ).catch((error) => {
            console.log(error);
        })

        if (response) {
            return response.data.result;
        }
    }    


    public async createMarketBuyOrder(instrument_name: string, notional: number): Promise<IOrder[] | undefined> {
        const response = await axios.post(
            "https://api.crypto.com/v2/private/create-order",
            this.sign({
                id: 1,
                method: "private/create-order",
                params: {
                    instrument_name:    instrument_name,
                    side:               "BUY",
                    type:               "MARKET",
                    notional:           notional
                },
                nonce: Date.now()
            })
        ).catch((error) => {
            console.log(error);
        })

        if (response) {
            return response.data.result;
        }
    }  

}