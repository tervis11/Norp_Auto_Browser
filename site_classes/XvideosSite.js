import {SitesBase} from "./SitesBase.js";

export class XvideosSite extends SitesBase {
    constructor() {
        super();
        this.site_key = "xvideos";

        this.domain = "https://www.xvideos.com";
        this.search_path = "k=";
    }

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}             query        The query to search for
     * @param   {number}             page_number  The page number to get the search results from
     * @returns {Promise<Document>}               The search results
     */
    search = async (query, page_number = 0) => {
        const url = `${this.domain}?k=${query}&p=${page_number || ""}`;
        const response = await fetch(url);
        const html = await response.text();

        let search_page = await window.help_functions.html_response_to_dom_document(html);

        return search_page;
    }

    get_last_page_number_from_pagination = async (page) =>  parseInt(page.querySelector(".pagination > ul > li:nth-last-child(2)").textContent);

    get_videos_from_page = async (page) => page.querySelectorAll(".thumb-block");

    get_video_id_from_video = async (video) => video.dataset.id;

    get_url_from_video = async (video) => video.querySelector("a").href.replace(/moz-extension:\/\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g, this.domain);
}