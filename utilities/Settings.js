export class Settings {
    constructor() {
        this._should_mute_videos = true;
        this._should_fullscreen_videos = false;
        this._should_play_favorite_videos = true;
        this._tags = ["Tifa", "Martha Stewart"]
        this._sites = ["xvideos_site", "xnxx_site", "xhamster_site", "tnaflix_site"];
        // this._sites = ["tnaflix_site"];
    }

    get should_play_favorite_videos() {
        return this._should_play_favorite_videos;
    }
    set should_play_favorite_videos(value) {
        this._should_play_favorite_videos = value;
    }

    get should_mute_videos() {
        return this._should_mute_videos;
    }
    set should_mute_videos(value) {
        this._should_mute_videos = value;
    }

    get should_fullscreen_videos() {
        return this._should_fullscreen_videos;
    }
    set should_fullscreen_videos(value) {
        this._should_fullscreen_videos = value;
    }

    get tags() { return this._tags; }
    set tags(value) { this._tags = value; }

    get sites() { return this._sites; }
    set sites(value) { this._sites = value; }
}