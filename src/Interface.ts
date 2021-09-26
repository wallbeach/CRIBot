interface IAccount {
    currency: string;
    balance: number;
    available: number;
    order: number;
    stake: number;
    currValue: number;
    expValue: number;
    current_price: number;
    currAllocation: number;
    expAllocation: number;
}

interface IInstrument {
    instrument_name: string;
    quote_currency: string;
    base_currency: string;
    price_decimals: number;
    quantity_decimals: number;
    margin_trading_enabled: boolean;
}

interface IOrder{
    status:                 string;
    reason:                 string;
    side:                   string;
    price:                  number;
    quantity:               number;
    order_id:               string;
    client_oid:             string;
    create_time:            number;
    update_time:            number;
    type:                   string;
    instrument_name:        string;
    cumulative_quantity:    number;
    cumulative_value:       number;
    avg_price:              number;
    fee_currency:           string;
    time_in_force:          string;
    exec_inst:              string;
    trigger_price:          number;

}

interface ITrade {
    instrument_name: string;
    side: string;
    fee: number;
    trade_id: string;
    create_time: string;
    traded_price: number;
    traded_quantity: number;
    fee_currency: string;
    order_id: string;
}

interface ITicker {
    i: string;
    h: number;
    v: number;
    a: number;
    l: number;
    b: number;
    k: number;
    c: number;
    t: number;
}

interface ICoin {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
}

interface IPosition {
    symbol: string;
    pair:   string;
    currValue: number;
    expValue: number;
    current_price: number;
}


export { IAccount, IOrder, ITrade, ICoin, ITicker, IInstrument }