import {XnxxSite} from "./site_classes/XnxxSite.js";
import {XvideosSite} from "./site_classes/XvideosSite.js";
import {XhamsterSite} from "./site_classes/XhamsterSite.js";
import {TnaflixSite} from "./site_classes/TnaflixSite.js";
import {PornhubSite} from "./site_classes/PornhubSite.js";
import {YoupornSite} from "./site_classes/YoupornSite.js";
import {RedtubeSite} from "./site_classes/RedtubeSite.js";
import {Tube8Site} from "./site_classes/Tube8Site.js";
import {Settings} from "./utilities/Settings.js";
import {HelpFunctions} from "./utilities/HelpFunctions.js";

/**
 * Add killswitch to stop the addon and close the tab
 */

class Main {
    constructor() {
        window.main = this;

        this.is_active = false;

        this.help_functions = new HelpFunctions();
        this.settings = new Settings();

        this.active_site = null;
        this.is_video_playing = false;
    }

    initialize = async () => {
        this.xnxx_site = new XnxxSite();
        this.xvideos_site = new XvideosSite();
        this.xhamster_site = new XhamsterSite();
        this.tnaflix_site = new TnaflixSite();
        this.pornhub_site = new PornhubSite();
        this.redtube_site = new RedtubeSite();
        this.tube8_site = new Tube8Site();
        this.youporn_site = new YoupornSite();

        await this.xvideos_site.initialize();
        await this.xnxx_site.initialize();
        await this.xhamster_site.initialize();
        await this.tnaflix_site.initialize();
        await this.pornhub_site.initialize();
        await this.redtube_site.initialize();
        await this.tube8_site.initialize();
        await this.youporn_site.initialize();

        this.classes = {
            xnxx_site: this.xnxx_site,
            xvideos_site: this.xvideos_site,
            xhamster_site: this.xhamster_site,
            tnaflix_site: this.tnaflix_site,
            pornhub_site: this.pornhub_site,
            redtube_site: this.redtube_site,
            tube8_site: this.tube8_site,
            youporn_site: this.youporn_site
        }

        browser.webNavigation.onCompleted.addListener(async () => {this.is_page_loaded = true});

        await browser.runtime.onMessage.addListener(async (message) => {
            if (message.video_has_ended && this.is_active) {
                await this.active_site.add_video_id_to_viewed_videos();

                await this.next_video();
            }
            else if (message.toggle_is_favorite) {
                await this.active_site.add_or_remove_video_id_to_favorite_videos();
            }
            else if (message.is_video_playing) {
                this.is_video_playing = message.is_video_playing;
            }
            else if (message.cs_script_is_ready) {
                await this.play_video();
            }
        });
    }

    start = async () => {
        this.is_active = true;
        await this.next_video();
    }

    stop = async () => {
        this.is_active = false;
    }

    next_video = async () => {
        this.is_page_loaded = false;

        this.active_site = await this.get_random_site();
        let next_video_url = await this.active_site.get_next_video_url();

        await browser.tabs.update({url: next_video_url});
    }

    get_random_site = async () => {
        //choose a random site from the list of sites in settings
        let random_site_index = Math.floor(Math.random() * this.settings.sites.length);
        let random_site = this.settings.sites[random_site_index];

        //get the class for the random site
        return this.classes[random_site];
    }

    play_video = async () => {
        let tabs = await browser.tabs.query({active: true, currentWindow: true});

        await browser.tabs.sendMessage(tabs[0].id, {is_favorite: this.active_site.is_favorite_video})
            .catch((error) => {
                console.log(error);
            });

        let play_try_max_count = 20;
        let play_try_count = 0;

        this.is_video_playing = false;
        await this.get_is_page_loaded();

        if (this.settings.should_mute_videos) {
            await this.active_site.video_controls.mute();
        }

        await this.active_site.video_controls.play();

        await window.main.help_functions.async_timeout(this.active_site.retry_delay);

        if (!this.is_video_playing) {
            await this.next_video();
        }
    }

    get_is_page_loaded = async () => {
        let is_page_loaded_count = 0;

        let is_page_loaded_interval = setInterval(async () => {
            if (this.is_page_loaded) {
                clearInterval(is_page_loaded_interval);
                return;
            }
            else if (!this.is_page_loaded && is_page_loaded_count < 10) {
                is_page_loaded_count++;
            }
            else {
                clearInterval(is_page_loaded_interval);
                await this.next_video();
            }
        }, 1000);
    }
}

let main = new Main();
await main.initialize();