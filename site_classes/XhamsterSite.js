import {SitesBase} from "./SitesBase.js";

export class XhamsterSite extends SitesBase {
    constructor() {
        super();
        this.site_key = "xhamster";

        this.domain = "https://www.xhamster.com";
        this.search_path = "search";
    }

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}             query        The query to search for
     * @param   {number}             page_number  The page number to get the search results from
     * @returns {Promise<Document>}               The search results
     */
    search = async (query, page_number = 0) => {
        let page_number_string = page_number === 0 ? "" : `?page=${page_number}`;

        const url = `${this.domain}/${this.search_path}/${query}${page_number_string}`;
        const response = await fetch(url);
        const html = await response.text();

        let search_page = await window.main.help_functions.html_response_to_dom_document(html);

        return search_page;
    }

    get_last_page_number_from_pagination = async (page) =>  parseInt(page.querySelector(".pager-container > ul > li:nth-last-child(2)").textContent);

    get_videos_from_page = async (page) => page.querySelectorAll("a.video-thumb__image-container");

    get_video_id_from_video = async (video) => video.querySelector(".thumb-image-container__sprite").id;

    get_url_from_video = async (video) => video.href;
}