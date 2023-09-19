import {SitesBase} from "./SitesBase.js";

export class Tube8Site extends SitesBase {
    constructor() {
        super();
        this.site_key = "tube8";

        this.domain = "https://www.tube8.com";
        this.search_path = "searches.html?q=";
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

    get_last_page_number_from_pagination = async (page) => parseInt(
        page.querySelector("ul#pagination > li:nth-last-child(2)").textContent.trim()
    );

    get_videos_from_page = async (page) => page.querySelectorAll(".video_box");

    get_video_id_from_video = async (video) => video.dataset.videoid;

    get_url_from_video = async (video) => video.dataset.video_url;
}