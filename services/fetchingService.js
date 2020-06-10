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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function changePage(page, previous) {
    if (previous === void 0) { previous = true; }
    return __awaiter(this, void 0, void 0, function () {
        var currentPage, lastPage, pages, nextPage, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPage(page)];
                case 1:
                    currentPage = _a.sent();
                    if (previous && currentPage === "1") {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, getLastPage(page)];
                case 2:
                    lastPage = _a.sent();
                    if (!previous && currentPage === lastPage) {
                        return [2 /*return*/, false];
                    }
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 14];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 12, , 13]);
                    return [4 /*yield*/, page.$$('#pagination a')];
                case 5:
                    pages = _a.sent();
                    if (!previous) return [3 /*break*/, 7];
                    return [4 /*yield*/, pages[1].click()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, pages[pages.length - 2].click()];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [4 /*yield*/, pageLoaded(page)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, getPage(page)];
                case 11:
                    nextPage = _a.sent();
                    if (currentPage !== nextPage) {
                        return [2 /*return*/, true];
                    }
                    return [3 /*break*/, 13];
                case 12:
                    e_1 = _a.sent();
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 3];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.changePage = changePage;
function getLastPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        var lastPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pageLoaded(page)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, page.evaluate(function () {
                            var pagination = document.querySelectorAll('#pagination a');
                            if (pagination.length) {
                                return pagination[pagination.length - 1].getAttribute("x-page");
                            }
                        })];
                case 3:
                    lastPage = _a.sent();
                    if (lastPage) {
                        return [2 /*return*/, lastPage];
                    }
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        var linkParts, link;
        return __generator(this, function (_a) {
            linkParts = page.url().split("/");
            link = linkParts[linkParts.length - 2];
            if (!isNaN(parseInt(link)))
                return [2 /*return*/, link];
            else
                return [2 /*return*/, "1"];
            return [2 /*return*/];
        });
    });
}
exports.getPage = getPage;
function pageLoaded(page) {
    return __awaiter(this, void 0, void 0, function () {
        var display;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, page.evaluate(function () {
                            var tableContainer = document.querySelector('#tournamentTable');
                            return tableContainer.style.display;
                        })];
                case 1:
                    display = _a.sent();
                    if (display === "block") {
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.pageLoaded = pageLoaded;
function changeTimezone(page) {
    return __awaiter(this, void 0, void 0, function () {
        var changeTimeZone, timeZone;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.waitForSelector('#user-header-timezone-expander')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.$('#user-header-timezone-expander')];
                case 2:
                    changeTimeZone = _a.sent();
                    if (!changeTimeZone) {
                        throw Error("Could not click on timezone changer");
                    }
                    return [4 /*yield*/, changeTimeZone.click()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector("a[href='/set-timezone/36/']")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.$("a[href='/set-timezone/36/']")];
                case 5:
                    timeZone = _a.sent();
                    if (!timeZone) {
                        throw Error("Could not change timezone to GMT0");
                    }
                    return [4 /*yield*/, timeZone.click()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.waitForNavigation()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, pageLoaded(page)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.changeTimezone = changeTimezone;
