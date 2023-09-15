export class SitesBase {
    constructor() {
        this.site_key = null;
        this.domain = null;
        this.search_path = null;
        this.search_tag = null;
        this.is_favorite_video = false;
        this.video_id = null;

        this.retry_delay = 10000;
    }

    initialize = async () => {
        await this.get_storage_area(this.site_key);

        await this.create_video_controls();
    }

    /**
     * Creates the video controls
     *
     * @returns {Promise<void>}
     */
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
     * Returns the next video url
     *
     * @returns {Promise<null>}
     */
    get_next_video_url = async () => {
        let random_tag = await this.get_random_tag();
        let initial_search_results = await this.search(random_tag);
        let shuffled_page_numbers = await this.get_shuffled_page_numbers(initial_search_results);
        let next_video_url = null;

        while (shuffled_page_numbers.length > 0) {
            let page_number = shuffled_page_numbers.shift();
            let search_results = await this.search(random_tag, page_number);
            let videos = await this.get_videos_from_page(search_results);
            let shuffled_videos = await window.main.help_functions.shuffle_array(videos);


            while (shuffled_videos.length > 0) {
                let video = shuffled_videos.shift();

                this.video_id = await this.get_video_id_from_video(video);
                let is_viewed_video = this.storage_area.viewed_videos.includes(this.video_id);
                this.is_favorite_video = this.storage_area.favorite_videos.includes(this.video_id);

                let should_use_video = !is_viewed_video || (window.main.settings.should_play_favorite_videos && this.is_favorite_video);

                if (should_use_video) {
                    next_video_url = await this.get_url_from_video(video);

                    return next_video_url;
                }
            }
        }

        return next_video_url;
    }

    /**
     * Returns a random tag from the tags array in settings
     *
     * @returns {Promise<string>}
     */
    get_random_tag = async () => {
        let tags = window.main.settings.tags;

        return tags[Math.floor(Math.random() * tags.length)];
    }

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}             query        The query to search for
     * @param   {number}             page_number  The page number to get the search results from
     * @returns {Promise<Document>}               The search results
     */
    search = async (query, page_number = 0) => {}

    /**
     * Returns a shuffled array of page numbers
     *
     * @param   {Document}        page      The page to get the page numbers from
     * @returns {Promise<*[]>}
     */
    get_shuffled_page_numbers = async (page) => {
        let last_page_number = await this.get_last_page_number_from_pagination(page);
        let page_numbers = [...Array(last_page_number).keys()];

        return window.main.help_functions.shuffle_array(page_numbers);
    }

    /**
     * Returns the last page number from the pagination
     *
     * @param   {Document}          page       The page to get the last page number from
     * @returns {Promise<number>}
     */
    get_last_page_number_from_pagination = async (page) => 0;

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
     * Returns the url from the video
     *
     * @param       {string}           video_element    The video element to get the url from
     * @returns     {Promise<null>}
     */
    get_url_from_video = async (video_element) => null;

    /**
     * Adds the video id to the viewed videos array in storage
     */
    add_video_id_to_viewed_videos = async () => {
        this.storage_area.viewed_videos.push(this.video_id);
    }

    /**
     * Adds the video id to the favorite videos array in storage
     */
    add_or_remove_video_id_to_favorite_videos = async () => {
        if (this.storage_area.favorite_videos.includes(this.video_id)) {
            this.storage_area.favorite_videos = this.storage_area.favorite_videos.filter((video_id) => video_id !== this.video_id);
        }
        else {
            this.storage_area.favorite_videos.push(this.video_id);
        }
    }

    get_storage_area = async () => {
        this.storage_area = await browser.storage.local.get(this.site_key);

        if (Object.keys(this.storage_area).length === 0) {
            console.log("Storage area not found, crafting a new one")
            await browser.storage.local.set({
                [this.site_key]: {
                    viewed_videos: [],
                    favorite_videos: []
                }
            });

            this.storage_area = await browser.storage.local.get(this.site_key);
        }

        this.storage_area = this.storage_area[this.site_key];
    }

    /////////////////////
    // Player controls //
   /////////////////////

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
        console.log(`Sending ${command} command to content script`)
        let tabs = await browser.tabs.query({active: true, currentWindow: true});

        return browser.tabs.sendMessage(tabs[0].id, {video_action: command})
            .catch((error) => {
                console.log(error);
            });
    }
}