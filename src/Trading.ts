import { CryptoService } from './CryptoService.js';
import { IAccount, IOrder, ITrade, ICoin, ITicker, IInstrument } from "./Interface";

const svc = new CryptoService();

export class Trading {

    public async createMarketBuyOrder(instrument: IInstrument, notional: number, ticker: ITicker, buyQuantity?: number) {

        // Fix the decimal places for the notional to be bought in this order.
        notional = Math.floor(notional * Math.pow(10, instrument.price_decimals)) / Math.pow(10, instrument.price_decimals);
    
        if (notional === 0) {
            console.log(`\u001b[1;31m [Alert] Notional 0`);
            return;
        }
    
        // Calculate the minimum notional that is needed to buy a position.
        const ask = ticker.k;
        const minimum = ask / Math.pow(10, instrument.quantity_decimals);
    
        if (notional < minimum * 1.1) {
            console.log(`\u001b[1;31m [Alert] Minimum Order size not reached [min. ${(minimum * 1.1).toFixed(3)} USDT]`);
            return;
        }
    
    
        await svc.createMarketBuyOrder(instrument.instrument_name, notional);
    
      //  console.log(`\u001b[1;32m  [Market Order] Buy of ${buyQuantity} ${instrument.base_currency} successful [${notional} USDT]`);
    }

    public async createMarketSellOrder(instrument: IInstrument, quantity: number, sellValue?: number) {

        // Fix the decimal places for the quantity to be sold in this order.
        quantity = Math.floor(quantity * Math.pow(10, instrument.quantity_decimals)) / Math.pow(10, instrument.quantity_decimals);
    
        if (quantity === 0) {
            console.log(`\u001b[1;31m [Alert] Quantity 0`);
            return;
        }
    
        await svc.createMarketSellOrder(instrument.instrument_name, quantity);
    
        console.log( `\u001b[1;35m [Market Order] Sell of ${quantity} ${instrument.base_currency} successful [${sellValue} USDT]`);
    }

    
}