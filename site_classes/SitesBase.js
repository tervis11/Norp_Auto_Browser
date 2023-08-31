import {Storage} from "../utilities/Storage.js";
import {Settings} from "../utilities/Settings.js";

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
        await this.create_video_controls();
    }

    create_video_controls = async () => {
        this.video_controls = {
            play: this.play_video,
            pause: this.pause_video,
            mute: this.mute_video,
            unmute: this.unmute_video,
            fullscreen: this.fullscreen_video,
            exit_fullscreen: this.exit_fullscreen_video
        }
    }

    /**
     * Returns a random tag from the tags array in settings
     *
     * @returns {Promise<string>}
     */
    get_random_tag = async () => {
        let tags = this.settings.tags;

        return tags[Math.floor(Math.random() * tags.length)];
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

    /**
     * Returns the url from the video
     *
     * @param       {string}           video_element    The video element to get the url from
     * @returns     {Promise<null>}
     */
    get_url_from_video = async (video_element) => null;

    goto_next_video = async (video) => {
        let random_tag = await this.get_random_tag();
        let search_results = await this.search(random_tag);
        let next_video = await this.get_next_video_from_page(search_results);
        let next_video_url = await this.get_url_from_video(next_video);

        await browser.tabs.update({url: next_video_url});
    }

    /**
     * Returns the videos from the page
     *
     * @param   {Document}                page            The page to get the videos from
     * @returns {Promise<HTMLElement[]>}                  The videos from the page as an array
     */
    get_videos_from_page = async (page) => [];

    /**
     * Returns the video id from the video
     *
     * @param    {string}          video_element        The video element to get the id from
     * @returns  {Promise<null>}
     */
    get_video_id_from_video = async (video_element) => null;

    /**
     * Sends a message to the content script to play the video
     * @returns {Promise<*>}
     */
    play_video = async () => {
        return this.send_video_command("play");
    }

    /**
     * Sends a message to the content script to pause the video
     *
     * @returns {Promise<*>}
     */
    pause_video = async () => {
        return this.send_video_command("pause");
    }

    /**
     * Sends a message to the content script to mute the video
     *
     * @returns {Promise<*>}
     */
    mute_video = async () => {
        return this.send_video_command("mute");
    }

    /**
     * Sends a message to the content script to unmute the video
     *
     * @returns {Promise<*>}
     */
    unmute_video = async () => {
        return this.send_video_command("unmute");
    }

    /**
     * Sends a message to the content script to fullscreen the video
     *
     * @returns {Promise<*>}
     */
    fullscreen_video = async () => {
        return this.send_video_command("fullscreen");
    }

    /**
     * Sends a message to the content script to exit fullscreen for the video
     *
     * @returns {Promise<*>}
     */
    exit_fullscreen_video = async () => {
        return this.send_video_command("exit_fullscreen");
    }

    /**
     * Sends a message to the content script containing the video action to perform
     *
     * @param   {string}            command        The video action to perform
     * @returns {Promise<any>}
     */
    send_video_command = async (command) => {
        let tabs = await browser.tabs.query({active: true, currentWindow: true});

        return browser.tabs.sendMessage(tabs[0].id, {video_action: command})
            .catch((error) => {
                console.log(error);
            });
    }
}