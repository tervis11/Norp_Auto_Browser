import {SitesBase} from "./SitesBase.js";

export class XnxxSite extends SitesBase {
    constructor() {
        super();
        this.site_key = "xnxx";

        this.domain = "https://www.xnxx.com";
        this.search_path = "/search/";
    }

    get_videos_from_page = async (page) => page.querySelectorAll(".thumb-block");

    get_video_id_from_video = async (video) => video.dataset.id;

    get_url_from_video = async (video) => video.querySelector("a").href.replace(/moz-extension:\/\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g, this.domain);
}