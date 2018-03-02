"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const LibFs = require("fs-extra");
const LibPath = require("path");
const minimatch_1 = require("minimatch");
function readfiles(path, ignores) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ignores) {
            ignores = [];
        }
        const ignoreFunctions = ignores.map((ignore) => {
            if (typeof ignore == 'function') {
                return ignore;
            }
            if (typeof ignore == 'string') {
                return (path, stats) => {
                    let matcher = new minimatch_1.Minimatch(ignore, { matchBase: true });
                    return (!matcher.negate || stats.isFile()) && matcher.match(path);
                };
            }
        });
        // read dir file
        let files = yield LibFs.readdir(path);
        if (!files.length) {
            return [];
        }
        // promise all
        let promises = [];
        files.forEach((file) => promises.push(filterFile(path, file, ignoreFunctions)));
        let res = yield Promise.all(promises);
        // merger filePaths
        let list = [];
        res.forEach((filePaths) => {
            list = list.concat(filePaths);
            console.log(list);
        });
        return list;
    });
}
exports.readfiles = readfiles;
function filterFile(path, file, ignoreFunctions) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = LibPath.join(path, file);
        let stat;
        try {
            stat = yield LibFs.stat(filePath);
        }
        catch (e) {
            return Promise.reject(e);
        }
        // filter ignore file
        if (ignoreFunctions.some((matcher) => matcher(filePath, stat))) {
            return [];
        }
        if (stat.isDirectory()) {
            try {
                return yield readfiles(filePath, ignoreFunctions);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            return [filePath];
        }
    });
}
