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

        return this.storage_area;
    }

    get_viewed_videos = async () => this.storage_area.viewed_videos;
    add_viewed_video = async (video_id) => this.storage_area.viewed_videos.push(video_id);
    remove_viewed_video = async (video_id) => this.storage_area.viewed_videos.splice(this.storage_area.viewed_videos.indexOf(video_id), 1);

    get_favorite_videos = async () => this.storage_area.favorite_videos;
    add_favorite_video = async (video_id) => this.storage_area.favorite_videos.push(video_id);
    remove_favorite_video = async (video_id) => this.storage_area.favorite_videos.splice(this.storage_area.favorite_videos.indexOf(video_id), 1);

    remove_storage_area = () => browser.storage.local.remove(this.site_key);
}