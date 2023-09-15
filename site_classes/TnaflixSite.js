import {SitesBase} from "./SitesBase.js";

export class TnaflixSite extends SitesBase {
    constructor() {
        super();
        this.site_key = "tnaflix";

        this.domain = "https://www.tnaflix.com";
        this.search_path = "search.php?what=";
    }

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}             query        The query to search for
     * @param   {number}             page_number  The page number to get the search results from
     * @returns {Promise<Document>}               The search results
     */
    search = async (query, page_number = 1) => {
        const url = `${this.domain}/${this.search_path}${query}&tab=videos&page=${page_number}`;
        const response = await fetch(url);
        const html = await response.text();

        let search_page = await window.main.help_functions.html_response_to_dom_document(html);

        return search_page;
    }

    get_last_page_number_from_pagination = async (page) => {
        let video_meta_description = page.querySelector("meta[name='description']");
        let video_count = parseInt(video_meta_description.content);

        let videos_per_page = 60;
        let last_page_number = Math.floor(video_count / videos_per_page);

        return last_page_number;
    };

    get_videos_from_page = async (page) => page.querySelectorAll("li[data-vid]");

    get_video_id_from_video = async (video) => video.dataset.vid;

    get_url_from_video = async (video) => video.querySelector("a.newVideoTitle").href.replace(/moz-extension:\/\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g, this.domain);
}