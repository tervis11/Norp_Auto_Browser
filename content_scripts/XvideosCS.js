(async () => {
    const content_script_base_js_url = browser.runtime.getURL("./content_scripts/ContentScriptBase.js");
    const ContentScriptBase = await import(content_script_base_js_url).then((module) => module.ContentScriptBase);

    class XvideosCS extends ContentScriptBase {
        constructor() {
            super();
            this.player_container_selector = "#hlsplayer";
            this.player_container_element = document.querySelector(this.player_container_selector);
            this.video_element = this.player_container_element.querySelector("video");

            this.video_element.removeAttribute("loop");
        }

        set_buttons = async () => {
            this.buttons = {
                play: this.player_container_element.querySelector("img[title='Play']"),
                pause: this.player_container_element.querySelector("img[title='Pause']"),
                mute: this.player_container_element.querySelector("img[title='Mute']"),
                unmute: this.player_container_element.querySelector("img[title='Unmute']"),
                fullscreen: this.player_container_element.querySelector("img[title='Fullscreen']")
            }
        }
    }

    let xvideos_cs = new XvideosCS();
    await xvideos_cs.initialize();
})();