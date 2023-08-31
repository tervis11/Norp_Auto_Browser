import {XnxxSite} from "./site_classes/XnxxSite.js";
import {Settings} from "./utilities/Settings.js";
import {HelpFunctions} from "./utilities/HelpFunctions.js";

class Main {
    constructor() {
        this.settings = new Settings();
        this.xnxx_site = new XnxxSite();

        window.help_functions = new HelpFunctions();

        window.main = this;
    }

    initialize = async () => {
        await this.xnxx_site.initialize();

        await browser.runtime.onMessage.addListener(async (message) => {
            if (message.video_has_ended) {
                await this.next_video();
            }
        });
    }

    run = async () => {
        await this.initialize();

        await this.next_video();
    }

    next_video = async () => {
        await this.xnxx_site.goto_next_video();

        if (!browser.webNavigation.onCompleted.hasListener(this.xnxx_site.video_controls.play)) {
            await browser.webNavigation.onCompleted.addListener(this.xnxx_site.video_controls.play);
        }

        if (this.settings.should_mute_videos) {
            await this.xnxx_site.video_controls.mute();
        }

        // TODO: figure out how to fullscreen the video
        // if (this.settings.should_fullscreen_videos) {
        //     await this.xnxx_site.video_controls.fullscreen();
        // }
    }
}

let main = new Main();
await main.run();