import { Config } from './Config.js';
import { CryptoService } from './CryptoService.js';
import { Trading } from './Trading.js';
import { IAccount, IOrder, ITrade, ICoin, ITicker, IInstrument } from "./Interface";


const config = new Config();
const trading = new Trading();
const svc = new CryptoService();

export class Account {
    _indexInstruments:   ICoin[];
    _tickers: ITicker[] | undefined;  
    _coinsMK: ICoin[] | undefined;  
    _accounts: IAccount[] | undefined;  
    _instruments: IInstrument[] | undefined;
    _exclStableCoins:  string[];
    _inclCoins:  string[];
    _exclCoins:  string[];

    _rebalTreshold: number;
    _dcaUseMoney: number; // Use Money in DCA until the 25th of each month

    _surplus: number;
    _usdtValue: number;
    _dcaAmount: number;
    _totalValue: number;

    constructor(){
        this._indexInstruments = [];
        this._tickers           = [];
        this._coinsMK           = [];
        this._accounts          = [];
        this._instruments       = [];

        this._exclStableCoins   = config.getExclStableCoins();
        this._inclCoins         = config.getInclCoins();
        this._exclCoins         = config.getExclCoins();
        this._rebalTreshold     = config.getRebalTreshold();
        this._dcaUseMoney       = config.getDcaUseMoney();
        this._surplus           = 0;
        this._usdtValue         = 0;
        this._dcaAmount         = 0;
        this._totalValue        = 0;
    }

    public getDcaAmount(): number {
        return this._dcaAmount;
    }

    public setDcaAmount(dcaAmount: number): void {
        this._dcaAmount = dcaAmount;
    }

    public getSurplus(): number {
        return this._surplus;
    }

    public setSurplus(surplus: number): void {
        this._surplus = surplus;
    }

    public getIndexInstruments(): ICoin[] {
        return this._indexInstruments;
    }

    public setIndexInstruments(indexInstruments: ICoin[]): void {
        this._indexInstruments = indexInstruments;
    }

    public getAccounts() {
        return this._accounts;
    }

    public setAccounts(accounts: IAccount[]): void {
        this._accounts = accounts;
    }

    public getTickers() {
        return this._tickers;
    }

    public setTickers(tickers: ITicker[]): void {
        this._tickers = tickers;
    }

    public async calcIndexInstruments() {
        // 1. Get Coins by market cap
        this._coinsMK = await svc.getCoinMK(`usd`, 100);

        // Get tickers
        this._tickers  = await svc.getAllTickers();

        const mcFrom = config.getMcFrom();
        let mcTo = config.getMcTo();


        if (this._coinsMK && this._tickers) {

            // Add Coins manually included as long as they are available on crypto.com exchange
            for (const c of this._inclCoins) {
                if(this._tickers.findIndex(obj => obj.i == `${c.toUpperCase()}_USDT`) != -1){        // Check if coin is avalable at crypto.com exchange
                    let coinIndex = this._coinsMK.findIndex(obj => obj.symbol.toUpperCase() == c.toUpperCase());  // get Coin by market cap as it's not allways in order
                    const coin = this._coinsMK[coinIndex];
                    this._indexInstruments.push(coin);
                    mcTo -= 1;
                }
            }

            for(let i = 1; i < 100; i++){       
            //for(const coin of this._coinsMK){
                let coinIndex = this._coinsMK.findIndex(obj => obj.market_cap_rank == i);  // get Coin by market cap as it's not allways in order
                const coin = this._coinsMK[coinIndex];
                if(!config.getExclStableCoins().includes(coin.symbol) && !this._indexInstruments.includes(coin) && !this._exclCoins.includes(coin.symbol)){
                    if (coin.market_cap_rank >= mcFrom && coin.market_cap_rank <= mcTo){
                        if(this._tickers.findIndex(obj => obj.i == `${coin.symbol.toUpperCase()}_USDT`) != -1){        // Check if coin is avalable at crypto.com exchange
                            this._indexInstruments.push(coin);
                        }else{
                            mcTo += 1;
                        }    
                    }else{
                        break;
                    }
                }else{
                    mcTo += 1;
                }
    
            }
        }
    }

    public async calcAllocation(){
        // Get all accounts
        this._accounts = await svc.getAllAccounts();

        if (this._accounts && this._tickers && this._indexInstruments && this._instruments) {

            for (const account of this._accounts) {
                let accountIndex = this._accounts.indexOf(account);
                let tickerIndex = this._tickers.findIndex(obj => obj.i == `${account.currency.toUpperCase()}_USDT`)
                let coinIndex = this._indexInstruments.findIndex(obj => obj.symbol.toLowerCase() == account.currency.toLowerCase());
                
                if (tickerIndex != -1){

                    this._accounts[accountIndex].current_price = this._tickers[tickerIndex].k;      // The current best bid price, null if there aren't any bids
                    this._accounts[accountIndex].currValue = this._tickers[tickerIndex].k * account.balance;

                    this._totalValue += this._accounts[accountIndex].currValue;
                    
                }  

                if(account.currency == 'USDT'){
                    this._usdtValue = account.balance;
                }
            }
            for (const account of this._accounts) {

                let coinIndex = this._indexInstruments.findIndex(obj => obj.symbol.toLowerCase() == account.currency.toLowerCase());
    
                if(coinIndex != -1){
                    
                    let currAllocation  = Math.round(account.currValue / this._totalValue * 100*1000)/1000;
                    let expAllocation   = Math.round(100/(this._indexInstruments.length) *1000)/1000;
                    let expValue        = this._totalValue / 100 * expAllocation;
                    let instrumentIndex = this._instruments.findIndex(obj => obj.instrument_name == `${account.currency.toUpperCase()}_USDT`);
                    let accountIndex    = this._accounts.indexOf(account);
                    
                    this._accounts[accountIndex].currAllocation  = currAllocation;
                    this._accounts[accountIndex].expAllocation   = expAllocation;
                    this._accounts[accountIndex].expValue        = expValue;
                    
                }    
            }


        }    
    }

    public async sellOutOfIndex(){
        //4. Sell Coins which are not in the list
        this._instruments = await svc.getInstruments();
        if (this._accounts && this._tickers && this._indexInstruments && this._instruments) {
            for (const account of this._accounts) {
                let coinIndex = this._indexInstruments.findIndex(obj => obj.symbol.toLowerCase() == account.currency.toLowerCase());

                if (coinIndex == -1 && account.currValue > 0.25 && !this._exclStableCoins.includes(account.currency.toLowerCase())){
                    console.log(`\u001b[1;33m [INDEX]\t${account.currency} fell out of index, sell position`);
                    let instrumentIndex = this._instruments.findIndex(obj => obj.instrument_name == `${account.currency.toUpperCase()}_USDT`);
                    await trading.createMarketSellOrder(this._instruments[instrumentIndex], account.balance, account.currValue);
                    this._surplus += account.current_price * account.balance;
                }
            }    
        }    
    }

    async sellOverperformers() {
        this._instruments = await svc.getInstruments();
        if(this._accounts && this._indexInstruments && this._instruments){
            for (const account of this._accounts) {
    
                let coinIndex = this._indexInstruments.findIndex(obj => obj.symbol.toLowerCase() == account.currency.toLowerCase());
                let instrumentIndex = this._instruments.findIndex(obj => obj.instrument_name == `${account.currency.toUpperCase()}_USDT`);

                if(coinIndex != -1){

                    if(account.currAllocation > account.expAllocation*(1 + this._rebalTreshold/100)){
                        let sellValue       = account.currValue - account.expValue;
                        let sellQuantity    = sellValue / account.current_price;
                        console.log(`[REBALANCE ${account.currency}]\tSELL ${sellQuantity}\tat a price of ${account.current_price}\tTotal ${sellValue.toFixed(3)} USDT]`);
                        //console.log(`[REBALANCE ${account.currency}] SELL ${sellQuantity} at a price of ${account.current_price} => Total ${sellValue.toFixed(3)} USDT]`);
    
                        await trading.createMarketSellOrder(this._instruments[instrumentIndex], sellQuantity, sellValue);
                        this._surplus += account.current_price * sellQuantity;
                    }
                }    
            }
        }    
    }

    async buyUnderperformers(rebalTreshold?: number) {

        let buyValue = 0;
        let treshold = this._rebalTreshold;
        if(rebalTreshold != undefined){
            treshold = rebalTreshold;
        }

        this._instruments = await svc.getInstruments();
        if(this._accounts && this._indexInstruments && this._instruments && this._tickers){
            // 5. Calculate current and expected allocation
            for (const account of this._accounts) {
    
                let coinIndex = this._indexInstruments.findIndex(obj => obj.symbol.toLowerCase() == account.currency.toLowerCase());
    
                if(coinIndex != -1){

                    let instrumentIndex = this._instruments.findIndex(obj => obj.instrument_name == `${account.currency.toUpperCase()}_USDT`);
                    let tickerIndex     = this._tickers.findIndex(obj => obj.i == `${account.currency.toUpperCase()}_USDT`);

                    
                    if(account.currAllocation < account.expAllocation*(1 - treshold/100)){
    
                        buyValue       = account.expValue - account.currValue;
                        let buyQuantity    = buyValue / account.current_price;
                        if (buyValue > this._surplus ){
                            buyValue = this._surplus;
                        }    
                            console.log(`[REBALANCE ${account.currency}]\tBUY ${buyQuantity}\tat a price of ${account.current_price}\t[${buyValue.toFixed(3)} USDT]`);
                         //   console.log(`[REBALANCE ${account.currency}] BUY ${buyQuantity} at a price of ${account.current_price} [${buyValue.toFixed(3)} USDT]`)
    
                            await trading.createMarketBuyOrder(this._instruments[instrumentIndex], buyValue, this._tickers[tickerIndex], buyQuantity);
                            this._surplus = this._surplus - buyValue;
                        
                    }
    
                    if(this._surplus == 0){
                        console.log(`[REBALANCE]\twas stopped because money limit was reached`);
                        return;
                    }
    
                }    
            }
        } 
    
    }

    async addMoney(dcaAmount: number){
        this._instruments = await svc.getInstruments();
        if(this._accounts && this._indexInstruments && this._instruments && this._tickers){
            // 5. Calculate current and expected allocation
            for (const account of this._accounts) {
    
                let coinIndex = this._indexInstruments.findIndex(obj => obj.symbol.toLowerCase() == account.currency.toLowerCase());
    
                if(coinIndex != -1){
    
                    let instrumentIndex = this._instruments.findIndex(obj => obj.instrument_name == `${account.currency.toUpperCase()}_USDT`);
                    let tickerIndex     = this._tickers.findIndex(obj => obj.i == `${account.currency.toUpperCase()}_USDT`);
    
                        let buyValue       = dcaAmount / this._indexInstruments.length;
                        let buyQuantity    = buyValue / account.current_price;
    
                        console.log(`[DCA ${account.currency}]\tBUY ${buyQuantity}\tat a price of ${account.current_price}\t[${(account.current_price * buyQuantity).toFixed(3)} USDT]`)
                        
                        await trading.createMarketBuyOrder(this._instruments[instrumentIndex], buyValue, this._tickers[tickerIndex], buyQuantity);
    
                }    
            }
        }
    
    }

    async calcDcaMoney(){
        const today = new Date;
        const dayNumber = today.getDate();

        let daysToNewMoney: number = 0;

        if(dayNumber >= this._dcaUseMoney){
            daysToNewMoney = 31 - dayNumber;
            daysToNewMoney += this._dcaUseMoney;
        }else{
            daysToNewMoney = this._dcaUseMoney - today.getDate();
        }

        this._dcaAmount = this._usdtValue / (daysToNewMoney + 1); // always keep 1 day of money as a reserve

    }

    async logInfo() {
        if (this._accounts) {
            
            console.log(`\u001b[1;36m[Info]\tTotal invested \t${this._totalValue} USD`);
            console.log(`\u001b[1;36m[Info]\tUSDT left \t${this._usdtValue} USDT`);

            for (const account of this._accounts) {
                let coinIndex = this._indexInstruments.findIndex(obj => obj.symbol.toLowerCase() == account.currency.toLowerCase());
                if(coinIndex != -1){
                    console.log(`[${account.currency}] \tRank ${this._indexInstruments[coinIndex].market_cap_rank}\tCurrent Allocation ${account.currAllocation}%\t[${account.currValue.toFixed(3)} USDT]\texpected Allocation ${account.expAllocation}%\t[${account.expValue.toFixed(3)} USDT]`);
            
                }
            }
        }
    }

}