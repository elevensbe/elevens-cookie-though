import { getPreferences, init, onPreferencesChanged, show } from "cookie-though";
import defaultConfig from "./defaultConfig";
import styles from "./styles.css?inline";

console.log("xxxx", document.currentScript);

function cookiesEnabled(prefs, category) {
    var tmp = prefs.cookieOptions.find((x) => x.id === category);
    if (tmp && tmp.isEnabled) return "granted";
    else return "denied";
}

const cfg = window.cookiePolicy || defaultConfig;
init(cfg);

var style = document.createElement("style");
style.innerHTML = styles;

document.querySelector(".cookie-though").shadowRoot.appendChild(style);

onPreferencesChanged((prefs) => {
    console.log("Cookie preferences changed", prefs);
    // update consent
    var consent = {
        ad_storage: cookiesEnabled(prefs, "marketing"),
        analytics_storage: cookiesEnabled(prefs, "statistics"),
        ad_user_data: cookiesEnabled(prefs, "marketing"),
        ad_personalization: cookiesEnabled(prefs, "marketing"),
        functionality_storage: cookiesEnabled(prefs, "preferences"),
        personalization_storage: cookiesEnabled(prefs, "preferences"),
        security_storage: "granted",
    };

    gtag("consent", "update", consent);
    dataLayer.push({ event: "cookie_consent_update" });
});

// Does the cookie exist?
if (document.cookie.indexOf("cookie-preferences") !== -1) {
    // There already was consent configured. Trigger the custom event.
    var prefs = getPreferences();
    if (prefs) {
        var consent = {
            ad_storage: cookiesEnabled(prefs, "marketing"),
            analytics_storage: cookiesEnabled(prefs, "statistics"),
            ad_user_data: cookiesEnabled(prefs, "marketing"),
            ad_personalization: cookiesEnabled(prefs, "marketing"),
            functionality_storage: cookiesEnabled(prefs, "preferences"),
            personalization_storage: cookiesEnabled(prefs, "preferences"),
            security_storage: "granted",
        };

        gtag("consent", "update", consent);
        dataLayer.push({ event: "cookie_consent_update" });
    }
}

const cookiePrefsButton = document.querySelector("[data-cookie-though]");
if (cookiePrefsButton) {
    cookiePrefsButton.addEventListener("click", (e) => {
        e.preventDefault();

        show();
    });
}
