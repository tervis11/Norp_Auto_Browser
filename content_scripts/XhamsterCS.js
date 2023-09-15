(async () => {
    const content_script_base_js_url = browser.runtime.getURL("./content_scripts/ContentScriptBase.js");
    const ContentScriptBase = await import(content_script_base_js_url).then((module) => module.ContentScriptBase);

    /**
     * play = xplayer.core.emit(101)
     * pause = xplayer.core.emit(102)
     * mute = xplayer.core.emit(103, 0)
     * unmute = xplayer.core.emit(103, .5)
     */

    class XhamsterCS extends ContentScriptBase {
        constructor() {
            super();
            this.player_container_selector = "#player-container";
            this.player_container_element = document.querySelector(this.player_container_selector);
            this.video_element = this.player_container_element.querySelector("video");

            this.video_element.removeAttribute("loop");
        }

        play_video = async () => {
            window.eval(`
                let play_interval = setInterval(() => {
                    if (!xplayer.core.states.states.playing && !xplayer.core.states.states.ended) {
                        xplayer.core.emit(101)
                        
                        clearInterval(play_interval);
                    }
                }, 1000);
            `);
        }

        pause_video = async () => {
            window.eval(`
                let pause_interval = setInterval(() => {
                    if (xplayer.core.states.states.playing) {
                        xplayer.core.emit(102)
                        
                        clearInterval(pause_interval);
                    }
                }, 1000);
            `);
        }

        mute_video = async () => {
            window.eval(`
                let mute_interval = setInterval(() => {
                    if (xplayer.core.states.states.sourceLoaded) {
                        xplayer.core.emit(103, 0)

                        clearInterval(mute_interval);
                    }
                }, 1000);
            `);
        }

        unmute_video = async () => {
            window.eval(`
                let unmute_interval = setInterval(() => {
                    if (xplayer.core.states.states.sourceLoaded) {
                        xplayer.core.emit(103, .5)

                        clearInterval(unmute_interval);
                    }
                }, 1000);
            `);
        }
    }

    let xhamster_cs = new XhamsterCS();
    await xhamster_cs.initialize();
})();