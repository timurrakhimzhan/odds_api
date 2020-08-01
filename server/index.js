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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const findMatch_1 = __importDefault(require("./routes/findMatch"));
const updateAbbreviation_1 = __importDefault(require("./routes/updateAbbreviation"));
const updateDate_1 = __importDefault(require("./routes/updateDate"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = express_1.default();
        const client = {};
        console.log("Connected to database");
        server.use(bodyParser.json());
        findMatch_1.default(server, client);
        updateAbbreviation_1.default(server, client);
        updateDate_1.default(server, client);
        server.listen(3000, () => console.log("Server listens at port 3000"));
    });
}
main();
