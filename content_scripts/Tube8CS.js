(async () => {
    const content_script_base_js_url = browser.runtime.getURL("./content_scripts/ContentScriptBase.js");
    const ContentScriptBase = await import(content_script_base_js_url).then((module) => module.ContentScriptBase);

    class Tube8CS extends ContentScriptBase {
        constructor() {
            super();
            this.player_container_selector = "#playerContainer";
            this.player_container_element = document.querySelector(this.player_container_selector);
            this.video_element = this.player_container_element.querySelector(".mgp_videoWrapper video");

            this.video_element.removeAttribute("loop");
        }

        play_video = async () => {
            window.eval(`
                let test_interval = setInterval(() => {
                    if (Object.values(MGP.players)[0].isReady() && !Object.values(MGP.players)[0].isPlaying()) {
                        Object.values(MGP.players)[0].play()
                        
                        clearInterval(test_interval);
                    }
                }, 1000);
            `);
        }

        mute_video = async () => {
            window.eval(`
                let test_interval = setInterval(() => {
                    if (Object.values(MGP.players)[0].isReady()) {
                        Object.values(MGP.players)[0].mute()
                        
                        clearInterval(test_interval);
                    }
                }, 1000);
            `)
        }
    }



    let tube8_cs = new Tube8CS();
    await tube8_cs.initialize();
})();