import {XnxxSite} from "./site_classes/XnxxSite.js";
import {XvideosSite} from "./site_classes/XvideosSite.js";
import {Settings} from "./utilities/Settings.js";
import {Storage} from "./utilities/Storage.js";
import {HelpFunctions} from "./utilities/HelpFunctions.js";

/**
 * Finish Adding favorites to and from the favorites list
 *
 * Add killswitch to stop the addon and close the tab
 *
 * Finish adding videos to the viewed list, after they have watched it for a certain amount of time
 *
 */

class Main {
    constructor() {
        this.is_active = false;

        this.help_functions = new HelpFunctions();
        this.settings = new Settings();
        this.storage = new Storage();

        window.main = this;
    }

    initialize = async () => {
        this.xnxx_site = new XnxxSite();
        this.xvideos_site = new XvideosSite();

        await this.xvideos_site.initialize();
        await this.xnxx_site.initialize();

        this.classes = [
            this.xnxx_site,
            this.xvideos_site
        ]

        await browser.runtime.onMessage.addListener(async (message) => {
            if (message.video_has_ended && this.is_active) {
                await this.next_video();
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
        let random_site = await this.get_random_site();
        let next_video_url = await random_site.get_next_video_url();

        await browser.tabs.update({url: next_video_url});

        if (!browser.webNavigation.onCompleted.hasListener(random_site.video_controls.play)) {
            await browser.webNavigation.onCompleted.addListener(random_site.video_controls.play);
        }

        if (this.settings.should_mute_videos) {
            await this.xvideos_site.video_controls.mute();
        }

        // TODO: figure out how to fullscreen the video
        // if (this.settings.should_fullscreen_videos) {
        //     await this.xnxx_site.video_controls.fullscreen();
        // }
    }

    get_random_site = async () => {
        let random_site_index = Math.floor(Math.random() * this.classes.length);
        let random_site = this.classes[random_site_index];

        return random_site;
    }
}

let main = new Main();
await main.initialize();