(function () {
    "use strict";

    let icon_url = browser.runtime.getURL("./icons/temp_fav_icon.png");

    let buttons = {
        play: document.querySelector("#hlsplayer img[title='Play']"),
        pause: document.querySelector("#hlsplayer img[title='Pause']"),
        mute: document.querySelector("#hlsplayer img[title='Mute']"),
        unmute: document.querySelector("#hlsplayer img[title='Unmute']"),
        fullscreen: document.querySelector("#hlsplayer img[title='Fullscreen']")
    }

    let video_element = document.querySelector("#hlsplayer video");

    // listen for messages from the background script
    browser.runtime.onMessage.addListener((message) => {
        if (message.hasOwnProperty("video_action")) {
            buttons[message.video_action].click();
        }
    })

    // listen for the video ending and send a message to the background script
    video_element.addEventListener("ended", (event) => {
         browser.runtime.sendMessage("addon@example.com", {video_has_ended: true})
    });

    // Add div to teh page for adding video to favorites
    let div = document.createElement("div");
    div.id = "nab_div";
    div.style = "position: absolute; top: 0; right: 0; background-color: rgba(0,0,0,0.5); z-index: 9999";
    div.innerHTML = `<button id='nab_add_to_favorites'><img src="${browser.runtime.getURL("../icons/temp_fav_icon.png")}" style="height: 50px; opacity: .5"></button>`;
    
    document.querySelector("#hlsplayer").prepend(div);

    let toggle_button = div.querySelector("#nab_add_to_favorites");
    toggle_button.addEventListener("click", async (event) => {
        let image = event.target;

        if (image.classList.contains("active")) {
            image.classList.remove("active");
            image.style.opacity = ".5";
        }
        else {
            image.classList.add("active");
            image.style.opacity = "1";
        }
    });
})();