export class Settings {
    constructor() {
        this._should_play_favorite_videos = true;
    }

    get should_play_favorite_videos() {
        return this._should_play_favorite_videos;
    }

    set should_play_favorite_videos(value) {
        this._should_play_favorite_videos = value;
    }
}