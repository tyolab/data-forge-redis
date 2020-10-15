import { assert } from 'chai';
import { IDataFrame, DataFrame } from 'data-forge';
import * as dataForge from 'data-forge';
import { Client } from '_debugger';

const redis = require('redis');

export interface RedisOptions {
    host: string;
    port: number;
    password: string;
}

/**
 * Reads from redis data source asynchonrously to a dataframe.
 */
export interface IAsyncRedisDataLoader {
    load (key: string, fromDate: Date, toDate: Date): Promise<IDataFrame<number, any>>;
    write (key: string, field: string, value: string): IAsyncRedisDataLoader;
}

export class RedisClient {
    static instance: any;

    constructor(options?: RedisOptions | null | undefined) {
        if (!RedisClient.instance)
            RedisClient.instance = redis.createClient(options);
    }

    // @ts-ignore
    async promisify (...args) {
        var args_array = [...args];
        var func = args_array.shift();
        // var key = args[0];
        // var field = args[1];
        // var targetValue = null;
        // if (args.length >= 3)
        //     targetValue = args[2];
    
        try {
            var retValue = await new Promise((resolve, reject) => {
    
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
        catch (err) {
            console.error(err);
        }
        return null;
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
    
    async get (key: string, fallbackValue: string) {
        var value = await this.promisify(RedisClient.instance.get, key);
        return value || fallbackValue;
    }

    static getDateStringArray (date : Date, toDate: Date) {
        let array: string[] = new Array();

        if (toDate < date)
            new Error("The from-date should be before the to-date");

        let fromDay = date.getDate();
        let fromYear = date.getFullYear();
        let fromMonth = date.getMonth() + 1;

        let toDay = toDate.getDate();
        let toYear = toDate.getFullYear();
        let toMonth = toDate.getMonth() + 1;

        for (var x = fromYear; x <= toYear; ++x) {
            for (var y = fromMonth; y <= toMonth; ++y) {
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
                if (y == toMonth && x == toYear) {
                    fromThisDate = fromDay;
                    toThisDate = toDay;
                }

                for (var z = fromThisDate; z <= toThisDate; ++z) {
                    array.push('' + x + (y > 9 ? '' : '0') + y + (z > 9 ? '' : '0') + z);
                }
            }
        }
        return array;
    }

    async load (key: string, fromDate: Date, toDate: Date, formater?: any) {
        // supposely the data string is in DDDD-MM-DD format
        let dateStringArray = RedisClient.getDateStringArray(fromDate, toDate);
        let rows: string[][] = new Array();
        let columnNames: string[] = new Array();
        columnNames.push('date');
        columnNames.push('open');
        columnNames.push('close');
        columnNames.push('high');
        columnNames.push('low');
        columnNames.push('volume');

        for (var i = 0; i < dateStringArray.length; ++i) {
            let row: string[] = new Array();
            let field = dateStringArray[i];

            row.push(field);

            let tmpStr:any = await this.hget(key, field);
            if (tmpStr) {
                let obj: any = JSON.parse(tmpStr);
                row.push(obj.O);
                row.push(obj.C);
                row.push(obj.H);
                row.push(obj.L);
                row.push(obj.V);
            }

            rows.push(row);
        }
        return new DataFrame<number, any>({
            rows: rows,
            columnNames: columnNames,
        });
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


    async load (key: string, fromDate: Date, toDate: Date): Promise<IDataFrame<number, any>> {
        return AsyncRedisDataLoader.client.load(key, fromDate, toDate);
    } 

    write (key: string, field: string, value: string): IAsyncRedisDataLoader {
        AsyncRedisDataLoader.client.hset(key, field, value);
        return this;
    }
}

/**
 * 
 */
// export interface ISyncRedisReader {

//     load (key: string, fromDate: Date, toDate: Date): IDataFrame<number, any>;
// }

// /**
//  * @hidden
//  * Reads a file synchonrously to a dataframe.
//  */
// class SyncRedisDataLoader implements ISyncRedisReader {

//     static client: RedisClient;

//     constructor(options: RedisOptions) {
//         if (!SyncRedisDataLoader.client)
//             SyncRedisDataLoader.client = new RedisClient(options);
//     }

//     load (key: string, fromDate: Date, toDate: Date): IDataFrame<number, any> {
//         async function syncLoad() {
//             let result: IDataFrame<number, any> = await SyncRedisDataLoader.client.load(key, fromDate, toDate);
//             return result;
//         }
//         // @ts-ignore
//         let result: IDataFrame<number, any> = syncLoad();
//         return result;
//     } 
// }

//
// Augmuent the data-forge namespace to add new functions.
//
declare module "data-forge" {

    function fromRedis (options?: RedisOptions | null | undefined): IAsyncRedisDataLoader;

    //export function fromRedisSync (filePath: string): ISyncRedisReader    
}

export function fromRedis (options?: RedisOptions | null | undefined): IAsyncRedisDataLoader {
    return new AsyncRedisDataLoader(options);
}

// /** */
// export function fromRedisSync(options: RedisOptions): ISyncRedisReader {
//     return new SyncRedisDataLoader(options);
// }

(dataForge as any).fromRedis = fromRedis;
// (dataForge as any).fromRedisSync = fromRedisSync;
