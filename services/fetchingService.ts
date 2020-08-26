import {ElementHandle, Page} from "puppeteer";

export async function changePage(page: Page, previous: Boolean = true): Promise<boolean> {
    const currentPage = await getPage(page);
    if(previous && currentPage === "1") {
        return false;
    }

    const lastPage = await getLastPage(page);
    if(!previous && currentPage === lastPage) {
        return false;
    }


    while(true) {
        try {
            let pages: Array<ElementHandle> = await page.$$('#pagination a');
            if(!pages) {
                return false;
            }
            if(previous) {
                await pages[1].click();
            } else {
                await pages[pages.length - 2].click();
            }
            await pageLoaded(page);
            let nextPage = await getPage(page);
            if(currentPage !== nextPage) {
                return true;
            }
        } catch(e) {}
    }
}

async function getLastPage(page: Page): Promise<string> {
    await pageLoaded(page);
    while(true) {
        const lastPage: string | void = await page.evaluate(() => {
            const pagination: NodeListOf<any> = document.querySelectorAll('#pagination a');
            if (pagination.length) {
                return pagination[pagination.length - 1].getAttribute("x-page");
            }
        });
        if(lastPage) {
            return lastPage;
        } else {
            return "1";
        }
    }
}

export async function getPage(page: Page): Promise<string> {
    let linkParts: Array<string> = page.url().split("/");
    let link: string = linkParts[linkParts.length - 2];
    if(!isNaN(parseInt(link)))
        return link;
    else return "1"
}

export async function pageLoaded(page: Page): Promise<void> {
    while(true) {
        const display: string | void = await page.evaluate(() => {
            const tableContainer = document.querySelector('#tournamentTable') as HTMLElement;
            return tableContainer.style.display;
        });
        if(display !== "none") {
            return;
        }
    }
}

export async function changeTimezone(page: Page): Promise<void> {
    await page.waitForSelector('#user-header-timezone-expander');
    const changeTimeZone: ElementHandle | null = await page.$('#user-header-timezone-expander');
    if(!changeTimeZone) {
        throw Error("Could not click on timezone changer")
    }
    await changeTimeZone.click();

    await page.waitForSelector("a[href='/set-timezone/36/']");
    const timeZone: ElementHandle | null = await page.$("a[href='/set-timezone/36/']");
    if(!timeZone) {
        throw Error("Could not change timezone to GMT0");
    }
    await timeZone.click();
    await page.waitForNavigation();
    await pageLoaded(page);

}