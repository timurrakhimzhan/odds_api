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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomModel = void 0;
const sequelize_1 = require("sequelize");
class CustomModel extends sequelize_1.Model {
    static getId(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.findOne({ where: attributes });
            if (!res) {
                throw new Error(`Can not find id of the record in the table ${this.tableName}`);
            }
            return res.get("id");
        });
    }
}
exports.CustomModel = CustomModel;
