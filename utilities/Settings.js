export class Settings {
    constructor() {
        this._should_play_favorite_videos = true;
        this._should_mute_videos = true;
        this._should_fullscreen_videos = true;
        this.tags = ["test", "a"]
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


}