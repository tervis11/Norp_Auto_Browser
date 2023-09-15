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

        play_video = async () => {
            window.eval(`
                let test_interval = setInterval(() => {
                    if (html5player.canPlay && !html5player.isPlaying) {
                        html5player.playClicked = true;
                        html5player.play();
                        
                        clearInterval(test_interval);
                    }
                }, 1000);
            `);
        }

        mute_video = async () => {
            this.video_element.muted = true;
        }
    }

    let xvideos_cs = new XvideosCS();
    await xvideos_cs.initialize();
})();