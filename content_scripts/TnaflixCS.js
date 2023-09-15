(async () => {
    /**
     * jsVideoData is a global variable that contains the video data for the current video.
     *
     * window.tplayer.playAt(0) - play the video from the beginning
     * window.tplayer.pause() - pause the video
     */
    const content_script_base_js_url = browser.runtime.getURL("./content_scripts/ContentScriptBase.js");
    const ContentScriptBase = await import(content_script_base_js_url).then((module) => module.ContentScriptBase);

    class TnaflixCS extends ContentScriptBase {
        constructor() {
            super();

            this.is_video_ready = false;
            this.player_container_element = document.querySelector("#flixPlayer");
            this.video_element = document.querySelector("#flixPlayerVideo");

            this.video_element.removeAttribute("loop");

            window.eval(`
                can_play = false;
                video_state = "loading";
            `);

            let can_play_interval = setInterval(() => {
                if (document.querySelector(".vidContPlay")) {
                    window.eval(`can_play = true;`);
                    clearInterval(can_play_interval);
                }
            });

            this.video_element.addEventListener("playing",  () => {
                window.eval(`video_state = "playing";`);
            });

            this.video_element.addEventListener("pause",  () => {
                window.eval(`video_state = "paused";`);
            });
        }

        play_video = async () => {
            window.eval(`
                let play_interval = setInterval(() => {
                    if (can_play && video_state !== "playing") {
                        document.querySelector(".pVideoNavBtn.pVideoPlayBtn").dispatchEvent(new Event("click"));
                        
                        video_state = "playing"
                        
                        clearInterval(play_interval);
                    }
                }, 1000);
            `);
        }

        pause_video = async () => {
            window.eval(`
                if (video_state === "playing") {
                    window.tplayer.pause();
                    
                    video_state = "paused"
                }
            `);
        }

        mute_video = async () => {
            document.querySelector(".pVideoVolumeBtn").dispatchEvent(new Event("click"));
        }
        unmute_video = async () => {
            document.querySelector(".pVideoVolumeBtn.pVideoVolumeOffBtn").dispatchEvent(new Event("click"));
        }
    }

    let tnaflix_cs = new TnaflixCS();
    await tnaflix_cs.initialize();
})();