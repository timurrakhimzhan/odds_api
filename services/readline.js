"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline"));
function questionPrompt(question) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.setPrompt(question + "\n");
    rl.prompt();
    return new Promise(function (resolve, reject) {
        rl.on('line', function (userInput) {
            rl.close();
            resolve(userInput);
        });
    });
}
exports.questionPrompt = questionPrompt;
