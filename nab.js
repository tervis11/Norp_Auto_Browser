import {XnxxSite} from "./site_classes/XnxxSite.js";
import {XvideosSite} from "./site_classes/XvideosSite.js";
import {Settings} from "./utilities/Settings.js";
import {HelpFunctions} from "./utilities/HelpFunctions.js";

class Main {
    constructor() {
        this.settings = new Settings();
        this.xnxx_site = new XnxxSite();
        this.xvideos_site = new XvideosSite();

        window.help_functions = new HelpFunctions();

        window.main = this;
    }

    initialize = async () => {
        await this.xvideos_site.initialize();

        await browser.runtime.onMessage.addListener(async (message) => {
            if (message.video_has_ended) {
                await this.next_video();
            }
        });
    }

    start = async () => this.next_video();

    stop = async () => {throw new Error();}

    next_video = async () => {
        let next_video_url = await this.xvideos_site.get_next_video_url();

        await browser.tabs.update({url: next_video_url});
        //
        // if (!browser.webNavigation.onCompleted.hasListener(this.xvideos_site.video_controls.play)) {
        //     await browser.webNavigation.onCompleted.addListener(this.xvideos_site.video_controls.play);
        // }
        //
        // if (this.settings.should_mute_videos) {
        //     await this.xvideos_site.video_controls.mute();
        // }

        // TODO: figure out how to fullscreen the video
        // if (this.settings.should_fullscreen_videos) {
        //     await this.xnxx_site.video_controls.fullscreen();
        // }
    }
}

let main = new Main();
await main.initialize();