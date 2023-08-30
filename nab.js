import {XnxxSite} from "./XnxxSite.js";
import {HelpFunctions} from "./HelpFunctions.js";

class Main {
    constructor() {
        this.xnxx_site = new XnxxSite();

        window.help_functions = new HelpFunctions();

        window.main = this;
    }

    initialize = async () => {
        await this.xnxx_site.initialize();
    }

    run = async () => {
        await this.initialize();

        let results_page = await this.xnxx_site.search("test");
        let next_video = await this.xnxx_site.get_next_video_from_page(results_page);
        let next_video_url = await this.xnxx_site.get_url_from_video(next_video);

        await browser.tabs.update({url: next_video_url});

        await this.xnxx_site.storage.viewed_videos.add(next_video.dataset.id);
    }
}

let main = new Main();
await main.run();