import { assert } from 'chai';
import { IDataFrame, DataFrame } from 'data-forge';
import * as dataForge from 'data-forge';
import { Client } from '_debugger';

const redis = require('redis');

export interface RedisOptions {
    host?: string;
    port?: number;
    password?: string;
    database?: number;
}

interface SymbolDate {
    symbol: string;
    fromDate: Date;
    toDate: Date;
}

export class RedisDataFrame <IndexT = number, ValueT = any> extends DataFrame <IndexT, ValueT> {
    dateArray: string[] = new Array();
}

/**
 * Reads from redis data source asynchonrously to a dataframe.
 */
export interface IAsyncRedisDataLoader {
    loadByDateArray (symbol: string, dateArray: string[], keyPrefix?: string) : Promise<IDataFrame<number, any>>;
    load (symbol: string, fromDate: Date, toDate: Date, keyPrefix?: string, codeChangeKeyPrefix?: string): Promise<IDataFrame<number, any>>;
    write (key: string, field: string, value: string): IAsyncRedisDataLoader;
}

export class RedisClient {
    static instance: any;

    constructor(options?: RedisOptions | null | undefined) {
        if (!RedisClient.instance) {
            RedisClient.instance = redis.createClient(options);

            if (options && options.database) {
                this.select(options.database);
            }
        }
    }

    // @ts-ignore
    async promisify (...args): Promise<any> {
        var args_array = [...args];
        var func = args_array.shift();

        let retValue = await new Promise((resolve, reject) => {
    
                // @ts-ignore
                var cb = function (err, value) {
                    if (err) return reject(err);
                
                    resolve((value));
                }
    
                args_array.push(cb);
    
                func.apply(RedisClient.instance, args_array);
            });

        return retValue;
    }

    async select (db: number) {
        await this.promisify(RedisClient.instance.select, db);
    }

    async exists (key: string) {
        var value = await this.promisify(RedisClient.instance.exists, key);
        return 1 == value;
    }
    
    async set (key: string, value: string) {
        return await this.promisify(RedisClient.instance.set, key, value);
    }
    
    async hset (key: string, field: string, value: string) {
        return await this.promisify(RedisClient.instance.hset, key, field, value);
    }
    
    async hget (key: string, field: string, fallbackValue?: string | undefined) {
        var value = await this.promisify(RedisClient.instance.hget, key, field);
        return value || fallbackValue;
    }

    async hgetall (key: string) {
        var value: string[]  = await this.promisify(RedisClient.instance.hgetall, key);
        return value;
    }
    
    async get (key: string, fallbackValue: string) {
        var value = await this.promisify(RedisClient.instance.get, key);
        return value || fallbackValue;
    }

    static getDateStringArray (startDate : Date, endDate: Date) {
        let array: string[] = new Array();

        if (endDate < startDate)
            new Error("The from-date should be before the to-date");

        let fromDate = startDate.getDate();
        let fromYear = startDate.getFullYear();
        let fromMonth = startDate.getMonth() + 1;

        let toDate = endDate.getDate();
        let toYear = endDate.getFullYear();
        let toMonth = endDate.getMonth() + 1;

        for (var x = fromYear; x <= toYear; ++x) {
            let fromThisMonth = 1;
            let toThisMonth = 12;
            if (x == fromYear) {
                fromThisMonth = fromMonth;
            }
            if (x == toYear) {
                toThisMonth = toMonth;
            }

            for (var y = fromThisMonth; y <= toThisMonth; ++y) {
                let maxDate = 31;
                switch (y) {
                    // case 1:
                    //     break;
                    case 2:
                        // just to make things simple
                        maxDate = 29;
                        break;
                    // case 3:
                    //     break;
                    case 4:
                        // break;
                    // case 5:
                    //     break;
                    case 6:
                        // break;
                    case 7:
                        // break;
                    // case 8:
                    //     break;
                    case 9:
                        // break;
                    // case 10:
                    //     break;
                    case 11:
                        maxDate = 30;
                        break;
                    // case 12:
                    //     break;                                                                                                                        
                }

                let fromThisDate = 1;
                let toThisDate = maxDate;
                if (y == fromMonth && x == fromYear) {
                    fromThisDate = fromDate;
                }
                if (y == toMonth && x == toYear) {
                    toThisDate = toDate;
                }

                for (var z = fromThisDate; z <= toThisDate; ++z) {
                    array.push('' + x + (y > 9 ? '' : '0') + y + (z > 9 ? '' : '0') + z);
                }
            }
        }
        return array;
    }

    async loadByDateArray(symbol: string, dateStringArray: string[], keyPrefix?: string) {
        let rows: string[][] = new Array();
        let columnNames: string[] = new Array();
        let keyStr = (keyPrefix || '') + symbol;
        columnNames.push('date');
        columnNames.push('open');
        columnNames.push('close');
        columnNames.push('high');
        columnNames.push('low');
        columnNames.push('volume');

        for (var i = 0; i < dateStringArray.length; ++i) {

            let field = dateStringArray[i];

            let tmpStr:any = await this.hget(keyStr, field);

            let row: string[] = new Array();
            row.push(field);
            if (tmpStr) {
                try {
                    let obj: any = JSON.parse(tmpStr);
                    row.push(obj.O);
                    row.push(obj.C);
                    row.push(obj.H);
                    row.push(obj.L);
                    row.push(obj.V);
                }
                catch(err) {
                    row.push("");
                    row.push("");
                    row.push("");
                    row.push("");
                    row.push("");
                }
            }
            else {
                row.push("");
                row.push("");
                row.push("");
                row.push("");
                row.push("");
            }
            rows.push(row);
        }

        return new DataFrame<number, any>({
            rows: rows,
            columnNames: columnNames,
        });
    }

    async load(symbol: string, fromDate: Date, toDate: Date, keyPrefix?: string, codeChangeKeyPrefix?: string) {
        keyPrefix = keyPrefix || '';

        let symbolDates: any[] = [];
        let tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);

        let lastToDate = toDate;

        // because there are lots of code changes, we need to consider that too
        // for example, on 30 Nov, ASX's FXL was changed to HUM
        // backward looking
        if (codeChangeKeyPrefix) {
            // we have to have a different key style for the code change right
            
            let symbolChange:string | null = symbol;

            while (symbolChange) {
                let codeChangeKey = codeChangeKeyPrefix + symbolChange;

                // the returned value will be in dict format
                let codeChanges = await this.hgetall(codeChangeKey);
                var codeChangesArray:any[] = [];
                if (codeChanges)
                    codeChangesArray = Object.keys(codeChanges).map((key) => codeChanges[key]);

                if (codeChangesArray.length > 0) {
                    // we need to sort the ranges first
                    // the code change with the older dates need to be put in the front
                    codeChangesArray.sort((a: any, b: any) => (a.from_date > b.from_date) ? 1: -1);

                    // only one is valid becuase in any given period of a time, there is only one code per stock possible
                    var i = 0;
                    for (; i < codeChangesArray.length; ++i) {
                        let codeChange: any = JSON.parse(codeChangesArray[i]);
                        if (codeChange.from_date) {
                            if (typeof codeChange.from_date == 'string')
                                codeChange.from_date = new Date(codeChange.from_date);
                        }
                        else {
                            codeChange.from_date = fromDate;
                        }
                        
                        if (!codeChange.to_date)
                            codeChange.to_date = tomorrowDate;

                        // we only need to take the first one that is overlapped with the given range
                        // the given start date and to_date is out of the code change range
                        // if there is only one entry we assume it only has been changed once we will just use the previous code
                        if (lastToDate < codeChange.to_date && lastToDate > codeChange.from_date) {
                            // if the code change from day is before the from date of the given range
                            let thisDate = (codeChange.from_date < fromDate) ? fromDate : codeChange.from_date;

                            symbolDates.unshift({symbol: symbolChange, fromDate: thisDate, toDate: lastToDate});

                            if (lastToDate > codeChange.from_date) {
                                lastToDate = new Date(codeChange.from_date.getTime());
                                lastToDate.setDate(codeChange.from_date.getDate() - 1);
                            }

                            if (fromDate < codeChange.from_date)
                                symbolChange = codeChange.from;
                            else // don't need to go any further as the requested day 
                                symbolChange = null;
                            break;
                        }
                        else if (codeChangesArray.length == 1) {
                            // if the code change is only for the company name, but the code is actually the same, so not to worry
                            if (codeChange.from === symbolChange) {
                                symbolChange = null;
                            }
                            else {
                                symbolChange = codeChange.from;
                            }

                            break;
                        }

                        if (!codeChange.from_date) {
                            // we don't know the from date
                            // we can't go any further
                            codeChange.from_date = fromDate;
                            symbolChange = null;
                        }

                        // if (!fromDate && !toDate)
                        //     break;
                        // we only need the one overlapped
                        // let codeChangeFromDate = codeChange.from_date;
                        // if (!codeChangeFromDate)
                        // the from date never be null
                        // and the code change rang must be within the date selection range
                        // if (fromDate >= codeChange.from_date && (!codeChange.to_date || toDate < codeChange.to_date)) {
                        //     // within range
                        //     // use only the new symbol, and there is no finite date yet
                        //     symbolDates.unshift({symbol: codeChange.to, fromDate: fromDate, toDate: toDate});
                        //     break;
                        // }
                        // else if (toDate < codeChange.from_date && fromDate < codeChange.from_date) {
                        //     // use only the old symbol
                        //     // but we need to check if old symbol has code change before
                        //     symbolChange = codeChange.from;
                        // }
                        // else {
                        //     // use both symbols
                        //     symbolDates.unshift({symbol: codeChange.to, from_date: codeChange.from_date, to_date: toDate});
                        //     // symbolDates.unshift({symbol: codeChange.from, from_date: codeChange.from_date, to_date: toDate});

                        //     // but we need to check if old symbol has code change before
                        //     toDate = codeChange.from_date;
                        //     toDate.setDate(toDate.getDate() - 1);
                        //     symbolChange = codeChange.from;
                        // }
                    }

                    if (i == codeChangesArray.length) {
                        // we didn't find anything
                        symbolDates.unshift({symbol: symbolChange, fromDate: fromDate, toDate: toDate});
                        symbolChange = null;
                    }
                }
                else {
                    // so no more code changes
                    symbolDates.unshift({symbol: symbolChange, fromDate: fromDate, toDate: toDate});

                    // reset the symbol change to empty
                    symbolChange = null;
                }
                
            }
        }
        else
            symbolDates.unshift({symbol: symbol, fromDate: fromDate, toDate: toDate});

        let rows: string[][] = new Array();
        let columnNames: string[] = new Array();
        columnNames.push('date');
        columnNames.push('open');
        columnNames.push('close');
        columnNames.push('high');
        columnNames.push('low');
        columnNames.push('volume');

        let dateArray: string[] = [];

        for (var x = 0; x < symbolDates.length; ++x) {
            let symbolDate = symbolDates[x];
            // supposely the data string is in DDDD-MM-DD format
            let dateStringArray = RedisClient.getDateStringArray(symbolDate.fromDate, symbolDate.toDate);
            let keyStr = (keyPrefix || '') + symbolDate.symbol;
            for (var i = 0; i < dateStringArray.length; ++i) {

                let field = dateStringArray[i];

                let tmpStr:any = await this.hget(keyStr, field);
                if (tmpStr) {

                    let row: string[] = new Array();

                    try {
                        let obj: any = JSON.parse(tmpStr);

                        dateArray.push(field);

                        row.push(field);
                        row.push(obj.O);
                        row.push(obj.C);
                        row.push(obj.H);
                        row.push(obj.L);
                        row.push(obj.V);
                        rows.push(row);
                    }
                    catch(err) {
                        //
                        console.error("Data format error, skipping date: " + field + " with data: " + tmpStr);
                        console.error(err);
                    }
                }
            }
        }

        let dataFrame = new RedisDataFrame<number, any>({
            rows: rows,
            columnNames: columnNames,
        });

        dataFrame.dateArray = dateArray;

        return dataFrame;
    }
} 

/**
 * @hidden
 * 
 */
class AsyncRedisDataLoader implements IAsyncRedisDataLoader {

    static client: RedisClient;

    constructor(options?: RedisOptions | null | undefined) {
        if (!AsyncRedisDataLoader.client)
            AsyncRedisDataLoader.client = new RedisClient(options);
    }

    async loadByDateArray(symbol: string, dateArray: string[], keyPrefix?: string): Promise<IDataFrame<number, any>> {
        return AsyncRedisDataLoader.client.loadByDateArray(symbol, dateArray, keyPrefix);
    } 

    async load(symbol: string, fromDate: Date, toDate: Date, keyPrefix?: string, codeChangeKeyPrefix?: string): Promise<IDataFrame<number, any>> {
        return AsyncRedisDataLoader.client.load(symbol, fromDate, toDate, keyPrefix, codeChangeKeyPrefix);
    } 

    write(key: string, field: string, value: string): IAsyncRedisDataLoader {
        AsyncRedisDataLoader.client.hset(key, field, value);
        return this;
    }
}

//
// Augmuent the data-forge namespace to add new functions.
//
declare module "data-forge" {

    function fromRedis (options?: RedisOptions | null | undefined): IAsyncRedisDataLoader;

}

export function fromRedis (options?: RedisOptions | null | undefined): IAsyncRedisDataLoader {
    return new AsyncRedisDataLoader(options);
}

(dataForge as any).fromRedis = fromRedis;
// (dataForge as any).fromRedisSync = fromRedisSync;
