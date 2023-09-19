import {SitesBase} from "./SitesBase.js";

export class RedtubeSite extends SitesBase {
    constructor() {
        super();
        this.site_key = "redtube";

        this.domain = "https://www.redtube.com";
        this.search_path = "?search=";
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
        let results_per_page = 35;
        let results_total_text = page.querySelector(".search_count").textContent;
        let results_total = parseInt(results_total_text.split(" ")[0].replace(/,/g, "").trim());

        return Math.floor(results_total / results_per_page);
    }

    get_videos_from_page = async (page) => page.querySelectorAll("#videolist_results_container ul > li");

    get_video_id_from_video = async (video) => video.querySelector("a.video_link").dataset.videoId;

    get_url_from_video = async (video) => video.querySelector("a.video_link").href.replace(/moz-extension:\/\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g, this.domain);
}