import { IAccount, IOrder, ITrade, ICoin, ITicker, IInstrument } from "./Interface";

export class Config {

    private rebalInterval:      number;
    private rebalTreshold:      number;
    private dcaUseMoney:        number;
    private exclStableCoins:    string[];
    private inclCoins:          string[];
    private exclCoins:          string[];

    private mcFrom:             number;
    private mcTo:               number;

    private apiKey:             string;
    private apiSecret:          string;

    constructor(){

        this.apiKey    = "";  
        this.apiSecret = "";  

    //    this.apiKey             = "";
    //    this.apiSecret          = "";

        this.exclStableCoins    = ["bnb", "usdt", "usdc", "busd", "dai", "ust", "lusd", "pax", "tusd", "fei"];  // Stable coins to hold value on the exchange
        this.exclCoins          = ["shib"];  // coins to exclude from the list (apart from stable coins)
        this.inclCoins          = ["cro"];  // coins to include in list even if they are out of the market cap range

        this.rebalInterval      = 12;        // Rebals per day (min. 1, max 24)

        this.rebalTreshold      = 5;        // Percent
        
        this.dcaUseMoney        = 25;       // Use USDT in DCA events until the 25th of each month

        this.mcFrom             = 1;        // Market cap rank starting    
        this.mcTo               = 20;       // Market cap rank ending
    }


    public getApiKey(): string {
        return this.apiKey;
    }

    public setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    public getApiSecret(): string {
        return this.apiSecret;
    }

    public setApiSecret(apiSecret: string): void {
        this.apiSecret = apiSecret;
    }

    public getInclCoins(): string[] {
        return this.inclCoins;
    }

    public setInclCoins(inclCoins: string[]): void {
        this.inclCoins = inclCoins;
    }

    public getExclCoins(): string[] {
        return this.exclCoins;
    }

    public setExclCoins(exclCoins: string[]): void {
        this.exclCoins = exclCoins;
    }

    public getExclStableCoins(): string[] {
        return this.exclStableCoins;
    }

    public setExclStableCoins(exclStableCoins: string[]): void {
        this.exclStableCoins = exclStableCoins;
    }

    public getRebalInterval(): number {
        return this.rebalInterval;
    }

    public setRebalInterval(rebalInterval: number): void {
        this.rebalInterval = rebalInterval;
    }

    public getRebalTreshold(): number {
        return this.rebalTreshold;
    }

    public setRebalTreshold(rebalTreshold: number): void {
        this.rebalTreshold = rebalTreshold;
    }

    public getDcaUseMoney(): number {
        return this.dcaUseMoney;
    }

    public setDcaUseMoney(dcaUseMoney: number): void {
        this.dcaUseMoney = dcaUseMoney;
    }

    public getMcFrom(): number {
        return this.mcFrom;
    }

    public setMcFrom(mcFrom: number): void {
        this.mcFrom = mcFrom;
    }

    public getMcTo(): number {
        return this.mcTo;
    }

    public setMcTo(mcTo: number): void {
        this.mcTo = mcTo;
    }

}