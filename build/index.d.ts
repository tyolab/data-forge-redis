import { DataFrame } from 'data-forge';
export interface RedisOptions {
    host?: string;
    port?: number;
    password?: string;
    database?: number;
}
export declare class RedisDataFrame<IndexT = number, ValueT = any> extends DataFrame<IndexT, ValueT> {
    symbol: string;
    dateArray: string[];
    fromDate: Date;
    toDate: Date;
    keyPrefix: string;
    codeChangeKeyPrefix: string;
}
/**
 * Reads from redis data source asynchonrously to a dataframe.
 */
export interface IAsyncRedisDataLoader {
    loadByDateArray(symbol: string, dateArray: string[], keyPrefix?: string): Promise<RedisDataFrame<number, any>>;
    load(symbol: string, fromDate: Date, toDate: Date, keyPrefix?: string, codeChangeKeyPrefix?: string): Promise<RedisDataFrame<number, any>>;
    write(key: string, field: string, value: string): IAsyncRedisDataLoader;
    update(oldDataFrame: RedisDataFrame<number, any>, toDate: Date): Promise<RedisDataFrame<number, any>>;
    get_client(): any;
}
export declare class RedisClient {
    static instance: any;
    constructor(options?: RedisOptions | null | undefined);
    get_instance(): any;
    promisify(...args: any[]): Promise<any>;
    select(db: number): Promise<void>;
    flushdb(): Promise<void>;
    del(key: string): Promise<void>;
    delall(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    set(key: string, value: string): Promise<any>;
    hset(key: string, field: string, value: string): Promise<any>;
    hget(key: string, field: string, fallbackValue?: string | undefined): Promise<any>;
    hgetall(key: string): Promise<string[]>;
    get(key: string, fallbackValue: string): Promise<any>;
    static getDateStringArray(startDate: Date, endDate: Date): string[];
    loadByDateArray(symbol: string, dateStringArray: string[], keyPrefix?: string): Promise<RedisDataFrame<number, any>>;
    update(oldDataFrame: RedisDataFrame<number, any>, toDate: Date): Promise<RedisDataFrame<number, any>>;
    load(symbol: string, fromDate: Date, toDate: Date, keyPrefix?: string, codeChangeKeyPrefix?: string): Promise<RedisDataFrame<number, any>>;
}
declare module "data-forge" {
    function fromRedis(options?: RedisOptions | null | undefined): IAsyncRedisDataLoader;
}
export declare function fromRedis(options?: RedisOptions | null | undefined): IAsyncRedisDataLoader;
