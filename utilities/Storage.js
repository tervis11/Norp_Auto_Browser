export class Storage {
    constructor() {
        this.site_key = null;
    }

    get_storage_area = async (site_key) => {
        this.site_key = site_key;
        this.storage_area = await browser.storage.local.get(this.site_key);

        if (Object.keys(this.storage_area).length === 0) {
            console.log("Storage area not found, crafting a new one")
            await browser.storage.local.set({
                [this.site_key]: {
                    viewed_videos: [],
                    favorite_videos: []
                }
            });

            this.storage_area = await browser.storage.local.get(this.site_key);
        }

        return this.storage_area[this.site_key];
    }

    set_video_controls = async () => {
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

    remove_storage_area = () => browser.storage.local.remove(this.site_key);
}