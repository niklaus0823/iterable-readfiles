import * as LibFs from 'fs-extra';
import * as LibPath from 'path';
import {Minimatch} from 'minimatch';

export interface IgnoreFunction {
    (path: string, stat?: LibFs.Stats): boolean
}
export type IgnoreType = string | IgnoreFunction;

export async function readfiles(path: string, ignores?: Array<IgnoreType>): Promise<Array<string>> {
    if (!ignores) {
        ignores = [];
    }

    const ignoreFunctions: Array<IgnoreFunction> = ignores.map((ignore: IgnoreType) => {
        if (typeof ignore == 'function') {
            return ignore as IgnoreFunction;
        }

        if (typeof ignore == 'string') {
            return (path: string, stats: LibFs.Stats) => {
                let matcher = new Minimatch(ignore as string, {matchBase: true});
                return (!matcher.negate || stats.isFile()) && matcher.match(path);
            };
        }
    });

    // read dir file
    let files: Array<string> = await LibFs.readdir(path);
    if (!files.length) {
        return [];
    }

    // promise all
    let promises = [];
    files.forEach((file) => promises.push(filterFile(path, file, ignoreFunctions)));
    let res = await Promise.all(promises);

    // merger filePaths
    let list: Array<string> = [];
    res.forEach((filePaths) => {
        list = list.concat(filePaths);
    });

    return list;
}

async function filterFile(path: string, file: string, ignoreFunctions: Array<IgnoreFunction>): Promise<Array<string>> {
    const filePath = LibPath.join(path, file);

    let stat: LibFs.Stats;
    try {
        stat = await LibFs.stat(filePath);
    } catch (e) {
        return Promise.reject(e);
    }

    // filter ignore file
    if (ignoreFunctions.some((matcher) => matcher(filePath, stat))) {
        return [];
    }

    if (stat.isDirectory()) {
        try {
            return await readfiles(filePath, ignoreFunctions);
        } catch (e) {
            return Promise.reject(e);
        }
    } else {
        return [filePath];
    }
}