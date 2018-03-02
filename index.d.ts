import * as LibFs from 'fs-extra';

export interface IgnoreFunction {
    (path: string, stat?: LibFs.Stats): boolean
}

export type IgnoreType = string | IgnoreFunction;

export interface readfiles {
    (path: string, ignores?: Array<IgnoreType>): Promise<Array<string>>
}