export class ContentScriptBase {
    constructor() {
        this.player_container_element = null;
        this.favorite_icon = null;
        this.video_element = null;
        this.buttons = null;
    }

    initialize = async () => {
        await this.add_favorite_icon();
        await this.set_event_listeners();
        await this.set_buttons();

        browser.runtime.onMessage.addListener((message) => {
            if (message.hasOwnProperty("video_action")) {
                this.buttons[message.video_action].click();
            }
             else if (message.hasOwnProperty("is_favorite")) {
                let div = document.querySelector("#nab_div");
                let image = div.querySelector("#nab_add_to_favorites img");

                if (message.is_favorite) {
                    image.classList.add("active");
                    image.style.opacity = "1";
                }
                else {
                    image.classList.remove("active");
                    image.style.opacity = ".5";
                }
            }
        });

        await browser.runtime.sendMessage("addon@example.com", {cs_script_is_ready: true});
    }

    set_buttons = async () => {}

    add_favorite_icon = async () => {
        console.log("ContentScriptBase.add_favorite_icon()");
        let icon_url = browser.runtime.getURL("./icons/temp_fav_icon.png");
        // Add div to teh page for adding video to favorites
        this.favorite_icon = document.createElement("div");
        this.favorite_icon.id = "nab_div";
        this.favorite_icon.style = "position: absolute; top: 0; right: 0; background-color: rgba(0,0,0, 0.5); z-index: 9999";
        this.favorite_icon.innerHTML = `<button id='nab_add_to_favorites'><img src="${browser.runtime.getURL("../icons/temp_fav_icon.png")}" style="height: 50px; opacity: .5"></button>`;
        this.favorite_icon.title = "Add to favorites";

        this.player_container_element.prepend(this.favorite_icon);
    }

    set_event_listeners = async () => {
        this.video_element.addEventListener("ended", (event) => {
         browser.runtime.sendMessage("addon@example.com", {video_has_ended: true})
    });
        this.video_element.addEventListener("playing", (event) => {
        browser.runtime.sendMessage("addon@example.com", {is_video_playing: true})
    });

        this.favorite_icon.addEventListener("click", async (event) => {
            await this.toggle_favorite();

            await browser.runtime.sendMessage("addon@example.com", {toggle_is_favorite: true})
        });
    }

    toggle_favorite = async () => {
        if (this.favorite_icon.classList.contains("active")) {
                this.favorite_icon.classList.remove("active");
                this.favorite_icon.style.opacity = ".5";
            }
            else {
                this.favorite_icon.classList.add("active");
                this.favorite_icon.style.opacity = "1";
            }

           await browser.runtime.sendMessage("addon@example.com", {toggle_is_favorite: true})
    }
}