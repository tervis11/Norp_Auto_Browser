import {XnxxSite} from "./site_classes/XnxxSite.js";
import {XvideosSite} from "./site_classes/XvideosSite.js";
import {XhamsterSite} from "./site_classes/XhamsterSite.js";
import {Settings} from "./utilities/Settings.js";
import {HelpFunctions} from "./utilities/HelpFunctions.js";

/**
 * Add killswitch to stop the addon and close the tab
 */

class Main {
    constructor() {
        this.is_active = false;

        this.help_functions = new HelpFunctions();
        this.settings = new Settings();

        this.active_site = null;
        this.is_video_playing = false;

        window.main = this;
    }

    initialize = async () => {
        this.xnxx_site = new XnxxSite();
        this.xvideos_site = new XvideosSite();
        this.xhamster_site = new XhamsterSite();

        await this.xvideos_site.initialize();
        await this.xnxx_site.initialize();
        await this.xhamster_site.initialize();

        this.classes = {
            xnxx_site: this.xnxx_site,
            xvideos_site: this.xvideos_site,
            xhamster_site: this.xhamster_site
        }

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
        this.is_video_playing = false;

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

        let is_playing_interval = setInterval(async () => {
            if (this.is_video_playing) {
                clearInterval(is_playing_interval);
                return;
            }
            else if (!this.is_video_playing && play_try_count < this.active_site.max_retries) {
                await this.active_site.video_controls.play();

                if (this.settings.should_mute_videos) {
                    await this.xvideos_site.video_controls.mute();
                }

                // TODO: figure out how to fullscreen the video
                // if (this.settings.should_fullscreen_videos) {
                //     await this.xnxx_site.video_controls.fullscreen();
                // }

                play_try_count++;
            }
            else {
                clearInterval(is_playing_interval);
                await this.next_video();
            }
        }, this.active_site.retry_delay);
    }
}

let main = new Main();
await main.initialize();