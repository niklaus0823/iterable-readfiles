import * as LibFs from 'fs-extra';
export type IgnoreFunction = (path: string, stat?: LibFs.Stats) => boolean;
export type IgnoreType = string | IgnoreFunction;
export type readfiles = {
    (path: string, ignores?: Array<IgnoreType>): Promise<Array<string>>
}