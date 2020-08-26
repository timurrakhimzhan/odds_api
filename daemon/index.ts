import {fetcher} from "./fetcher";

async function daemon() {
    await fetcher();
    console.log("Crawled. Waiting for an hour...")
    setTimeout(daemon, 1000 * 60 * 60);
}

if(require?.main === module) {
    daemon()
}