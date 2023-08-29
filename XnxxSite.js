import {SitesBase} from "./SitesBase.js";

export class XnxxSite extends SitesBase {
    constructor() {
        super();

        this.domain = "https://www.xnxx.com";
        this.search_path = "/search/";
    }

    async get_videos_from_page(page) {
        const videos = page.querySelectorAll(".thumb-block");
        const videos_array = [];

        for (let video of videos) {
            videos_array.push(video);
        }

        return videos_array;
    }
}