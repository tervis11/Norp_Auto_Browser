import {XnxxSite} from "./XnxxSite.js";
import {HelpFunctions} from "./HelpFunctions.js";

class Main {
    constructor() {
        window.help_functions = new HelpFunctions();
        this.XnxxSite = new XnxxSite();
    }

    async run() {
        let search_results = await this.XnxxSite.search("test");
        let next_video = await this.XnxxSite.get_next_video_from_page(search_results);
    }
}

let main = new Main();
main.run().then();

