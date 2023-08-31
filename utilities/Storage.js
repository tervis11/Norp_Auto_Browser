export class Storage {
    constructor(site_key) {
        this.site_key = site_key;
    }

    initialize = async () => {
        this.storage_area = await this.get_storage_area();

        this.viewed_videos = {
            get: async () => this.storage_area.viewed_videos,
            add: async (video_id) => this.storage_area.viewed_videos.push(video_id),
            remove: async (video_id) => this.storage_area.viewed_videos = this.storage_area.viewed_videos.filter((video) => video !== video_id),
            includes: async (video_id) => this.storage_area.viewed_videos.includes(video_id)
        };
        this.favorite_videos = {
            get: async () => this.storage_area.favorite_videos,
            add: async (video_id) => this.storage_area.favorite_videos.push(video_id),
            remove: async (video_id) => this.storage_area.favorite_videos = this.storage_area.favorite_videos.filter((video) => video !== video_id),
            includes: async (video_id) => this.storage_area.favorite_videos.includes(video_id)
        };
    }

    get_storage_area = async () => {
        let storage_area = browser.storage.sync.get(this.site_key);

        if (Object.keys(storage_area).length === 0) {
            console.log("Storage area not found, creating a new one")
            await browser.storage.sync.set({
                [this.site_key]: {
                    viewed_videos: [],
                    favorite_videos: []
                }
            });

            storage_area = await browser.storage.sync.get(this.site_key);
        }

        return storage_area[this.site_key];
    }

    remove_storage_area = () => browser.storage.sync.remove(this.site_key);
}