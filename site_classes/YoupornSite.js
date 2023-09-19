import {SitesBase} from "./SitesBase.js";

export class YoupornSite extends SitesBase {
    constructor() {
        super();
        this.site_key = "youporn";

        this.domain = "https://www.youporn.com";
        this.search_path = "search/?query=";
    }

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}             query        The query to search for
     * @param   {number}             page_number  The page number to get the search results from
     * @returns {Promise<Document>}               The search results
     */
    search = async (query, page_number = 1) => {
        await window.main.help_functions.async_timeout(1000);

        const url = `${this.domain}/${this.search_path}${query}&page=${page_number}`;
        const response = await fetch(url);
        const html = await response.text();

        let search_page = await window.main.help_functions.html_response_to_dom_document(html);

        return search_page;
    }

    get_shuffled_page_numbers = async (page) => {
        let last_page_number = await this.get_last_page_number_from_pagination(page);
        let page_numbers = [...Array(last_page_number).keys()];

        page_numbers.shift();

        return window.main.help_functions.shuffle_array(page_numbers);
    }

    get_last_page_number_from_pagination = async (page) => {
        let regex = /searchCount: \d+,/g;
        let search_count_text = page.querySelector(".filters-wrapper script").textContent.trim().match(regex)[0];
        let search_count = parseInt(search_count_text.split(" ")[1].replace(/,/g, "").trim());

        let results_per_page = 32;
        return Math.floor(search_count / results_per_page);
    }

    get_videos_from_page = async (page) => page.querySelectorAll(".searchResults .video-box");

    get_video_id_from_video = async (video) => video.dataset.videoId;

    get_url_from_video = async (video) => video.querySelector("a.video-title").href.replace(/moz-extension:\/\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g, this.domain);
}