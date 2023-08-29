export class SitesBase {
    constructor() {
        this.domain = null;
        this.search_path = null;
        this.search_tag = null;
    }

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}                       query        The query to search for
     * @returns {Promise<Document>}                         The search results
     */
    async search(query) {
        const url = this.domain + this.search_path + query;
        const response = await fetch(url);
        const html = await response.text();

        return await window.help_functions.html_response_to_dom_document(html);
    }

    /**
     * Returns the next video from the page
     *
     * @param   {Document}                     page         The page to get the next video from
     * @returns {Promise<*>}                                The next video
     */
    async get_next_video_from_page(page) {
        let videos = await this.get_videos_from_page(page);

        return videos[0];
    }

    // place holders
    /**
     * Returns the videos from the page
     *
     * @param   {Document}              page            The page to get the videos from
     * @returns {Promise<HTMLElement[]>}                The videos from the page as an array
     */
    async get_videos_from_page(page) {
        return [];
    }
}