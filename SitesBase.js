import {Storage} from "./Storage.js";
import {Settings} from "./Settings.js";

export class SitesBase {
    constructor() {
        this.site_key = null;
        this.domain = null;
        this.search_path = null;
        this.search_tag = null;

        this.storage = new Storage(this.site_key);
        this.settings = new Settings();
    }

    initialize = async () => {
        await this.storage.initialize();
    }

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}                       query        The query to search for
     * @returns {Promise<Document>}                         The search results
     */
    search = async (query) => {
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
    get_next_video_from_page = async (page) => {
        let videos = await this.get_videos_from_page(page);

        for (let video of videos) {
            let video_id = await this.get_video_id_from_video(video);
            let is_viewed_video = await this.storage.viewed_videos.includes(video_id);
            let is_favorite_video = await this.storage.favorite_videos.includes(video_id);

            let should_use_video = !is_viewed_video || (this.settings.should_play_favorite_videos && is_favorite_video);

            if (should_use_video) {
                return video;
            }
        }

        return null;
    }

    // place holders
    /**
     * Returns the videos from the page
     *
     * @param   {Document}              page            The page to get the videos from
     * @returns {Promise<HTMLElement[]>}                The videos from the page as an array
     */
    get_videos_from_page = async (page) => [];

    get_video_id_from_video = async (video_id) => null;

    get_url_from_video = async (video) => null;
}