(async () => {
    const content_script_base_js_url = browser.runtime.getURL("./content_scripts/ContentScriptBase.js");
    const ContentScriptBase = await import(content_script_base_js_url).then((module) => module.ContentScriptBase);

    class XhamsterCS extends ContentScriptBase {
        constructor() {
            super();
            this.player_container_selector = "#player-container";
            this.player_container_element = document.querySelector(this.player_container_selector);
            this.video_element = this.player_container_element.querySelector("video");

            this.video_element.removeAttribute("loop");
        }

        set_buttons = async () => {
            this.buttons = {
                play: this.player_container_element.querySelector(".control-bar .play:not(.pause)"),
                pause: this.player_container_element.querySelector(".control-bar .play.pause"),
                mute: this.player_container_element.querySelector(".volume:not(.mute)"),
                unmute: this.player_container_element.querySelector(".volume.mute"),
                fullscreen: this.player_container_element.querySelector(".fullscreen-button")
            }
        }
    }

    let xhamster_cs = new XhamsterCS();
    await xhamster_cs.initialize();
})();