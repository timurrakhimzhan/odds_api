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
function changePage(page, previous = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentPage = yield getPage(page);
        if (previous && currentPage === "1") {
            return false;
        }
        const lastPage = yield getLastPage(page);
        if (!previous && currentPage === lastPage) {
            return false;
        }
        while (true) {
            try {
                let pages = yield page.$$('#pagination a');
                if (previous) {
                    yield pages[1].click();
                }
                else {
                    yield pages[pages.length - 2].click();
                }
                yield pageLoaded(page);
                let nextPage = yield getPage(page);
                if (currentPage !== nextPage) {
                    return true;
                }
            }
            catch (e) { }
        }
    });
}
exports.changePage = changePage;
function getLastPage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pageLoaded(page);
        while (true) {
            const lastPage = yield page.evaluate(() => {
                const pagination = document.querySelectorAll('#pagination a');
                if (pagination.length) {
                    return pagination[pagination.length - 1].getAttribute("x-page");
                }
            });
            if (lastPage) {
                return lastPage;
            }
        }
    });
}
function getPage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let linkParts = page.url().split("/");
        let link = linkParts[linkParts.length - 2];
        if (!isNaN(parseInt(link)))
            return link;
        else
            return "1";
    });
}
exports.getPage = getPage;
function pageLoaded(page) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const display = yield page.evaluate(() => {
                const tableContainer = document.querySelector('#tournamentTable');
                return tableContainer.style.display;
            });
            if (display === "block") {
                return;
            }
        }
    });
}
exports.pageLoaded = pageLoaded;
function changeTimezone(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector('#user-header-timezone-expander');
        const changeTimeZone = yield page.$('#user-header-timezone-expander');
        if (!changeTimeZone) {
            throw Error("Could not click on timezone changer");
        }
        yield changeTimeZone.click();
        yield page.waitForSelector("a[href='/set-timezone/36/']");
        const timeZone = yield page.$("a[href='/set-timezone/36/']");
        if (!timeZone) {
            throw Error("Could not change timezone to GMT0");
        }
        yield timeZone.click();
        yield page.waitForNavigation();
        yield pageLoaded(page);
    });
}
exports.changeTimezone = changeTimezone;
