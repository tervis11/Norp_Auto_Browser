(async () => {
    const content_script_base_js_url = browser.runtime.getURL("./content_scripts/ContentScriptBase.js");
    const ContentScriptBase = await import(content_script_base_js_url).then((module) => module.ContentScriptBase);

    class TnaflixCS extends ContentScriptBase {
        constructor() {
            super();

            this.player_container_element = document.querySelector("#flixPlayer");
            this.video_element = document.querySelector("#flixPlayerVideo");

            this.video_element.removeAttribute("loop");
        }

        set_buttons = async () => {
            this.buttons = {
                play: this.player_container_element.querySelector("button.pVideoPlayBtn"),
                pause: this.player_container_element.querySelector("button.pVideoPauseBtn"),
                mute: this.player_container_element.querySelector("button.button.pVideoVolumeBtn:not(.pVideoVolumeOffBtn)"),
                unmute: this.player_container_element.querySelector("button.pVideoVolumeBtn.pVideoVolumeOffBtn"),
                fullscreen: this.player_container_element.querySelector("button.pVideoResizeFullBtn")
            }
        }
    }

    let tnaflix_cs = new TnaflixCS();
    await tnaflix_cs.initialize();
})();