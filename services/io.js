"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function getFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            resolve(JSON.parse(data.toString()));
        });
    });
}
exports.getFile = getFile;
function writeFile(filepath, data) {
    if (typeof data === 'object')
        data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => {
            if (err)
                reject(err);
            resolve(filepath);
        });
    });
}
exports.writeFile = writeFile;
function appendToFile(filename, text) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        fs.appendFile(`${__dirname}/${filename}`, text, {}, (err) => {
            console.log('Appended.');
            resolve();
        });
    }));
}
exports.appendToFile = appendToFile;
function createDirectory(filename) {
    return new Promise((resolve, reject) => {
        let filenameSplitted = filename.split("/");
        filenameSplitted.length--;
        filename = filenameSplitted.join("/");
        fs.mkdir(`${__dirname}/${filename}`, { recursive: true }, (err) => {
            if (err)
                reject(err);
            resolve();
        });
    });
}
exports.createDirectory = createDirectory;
