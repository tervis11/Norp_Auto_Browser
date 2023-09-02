const BUTTON_STATE = {
    ON: "on",
    OFF: "off"
}

class Popup {
    constructor() {}

    initialize = async () => {
        this.background_window = await browser.runtime.getBackgroundPage();
        this.settings = this.background_window.main.settings;
        this.popup_element = document.querySelector("#popup");

        this.site_option_checkboxes = document.querySelectorAll(".site-option");
        this.on_off_buttons = document.querySelectorAll(".on-off-button");
        this.tags_textarea = document.querySelector("#tags_textarea");
        this.start_button = document.querySelector("#start_button");
        this.stop_button = document.querySelector("#stop_button");
        this.should_play_favorite_videos_checkbox = document.querySelector("#should_play_favorite_videos");
        this.should_mute_videos_checkbox = document.querySelector("#should_mute_videos");
        this.should_fullscreen_videos_checkbox = document.querySelector("#should_fullscreen_videos");

        await this.set_event_listeners();

        await this.update_ui();
    }

    set_event_listeners = async () => {
        this.start_button.addEventListener("click", this.start_auto_browser);
        this.stop_button.addEventListener("click", this.stop_auto_browser);
        this.tags_textarea.addEventListener("input", this.update_tags_setting);
        this.should_play_favorite_videos_checkbox.addEventListener("change", this.update_should_play_favorite_videos_setting);
        this.should_mute_videos_checkbox.addEventListener("change", this.update_should_mute_videos_setting);
        this.should_fullscreen_videos_checkbox.addEventListener("change", this.update_should_fullscreen_videos_setting);

        for (let site_option_checkbox of this.site_option_checkboxes) {
            site_option_checkbox.addEventListener("change", this.update_sites_setting);
        }
    }

    start_auto_browser = async () => this.background_window.main.start();
    stop_auto_browser = async () => this.background_window.main.stop();

    update_sites_setting = async (event) => {
        let event_target = event.target;

        if (event_target.checked) {
            this.settings.sites.push(event_target.dataset.setting);
        }
        else {
            this.settings.sites = this.settings.sites.filter((site) => site !== event_target.dataset.setting);
        }

        await this.update_button_state(event_target);
    }
    update_tags_setting = async () => {
        this.settings.tags = this.tags_textarea.value.replace(/[\n\r]/g, '').trim().split(/,|\n/);
    }
    update_should_play_favorite_videos_setting = async (event) => {
        let event_target = event.target;
        this.settings.should_play_favorite_videos = this.should_play_favorite_videos_checkbox.checked;

        await this.update_button_state(event_target);
    }
    update_should_mute_videos_setting = async (event) => {
        let event_target = event.target;
        this.settings.should_mute_videos = this.should_mute_videos_checkbox.checked;

        await this.update_button_state(event_target);
    }
    update_should_fullscreen_videos_setting = async (event) => {
        let event_target = event.target;
        this.settings.should_fullscreen_videos = this.should_fullscreen_videos_checkbox.checked;

        await this.update_button_state(event_target);
    }
    update_button_state = async (button_input_element) => {
        let button_input = button_input_element;
        let button_label = button_input.parentElement;
        let button_state = button_input.checked ? BUTTON_STATE.ON : BUTTON_STATE.OFF;

        if (button_state === BUTTON_STATE.ON) {
            button_label.classList.add(BUTTON_STATE.ON);
            button_label.classList.remove(BUTTON_STATE.OFF);
        }
        else {
            button_label.classList.add(BUTTON_STATE.OFF);
            button_label.classList.remove(BUTTON_STATE.ON);
        }
    }
    update_ui = async () => {
        for (let site_option_checkbox of this.site_option_checkboxes) {
            site_option_checkbox.checked = this.settings.sites.includes(site_option_checkbox.dataset.setting);
        }

        this.tags_textarea.value = this.settings.tags.join(", ");

        this.should_play_favorite_videos_checkbox.checked = this.settings.should_play_favorite_videos;
        this.should_mute_videos_checkbox.checked = this.settings.should_mute_videos;
        this.should_fullscreen_videos_checkbox.checked = this.settings.should_fullscreen_videos;

        for (let on_off_button of this.on_off_buttons) {
            await this.update_button_state(on_off_button.children[0]);
        }
    }
}

let popup = new Popup();
await popup.initialize();

