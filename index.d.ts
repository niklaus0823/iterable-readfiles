import * as LibFs from 'fs-extra';

export declare interface IgnoreFunction {
    (path: string, stat?: LibFs.Stats): boolean
}

export declare type IgnoreType = string | IgnoreFunction;

export declare function readfiles(path: string, ignores?: Array<IgnoreType>): Promise<Array<string>>;