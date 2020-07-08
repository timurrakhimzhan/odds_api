export interface CrawlerState {
    finishedCrawling?: boolean,
    functionMatchCreated?: boolean,
    daemon?: boolean
}

export interface State {
    crawler: CrawlerState
}