import { getPreferences, init, onPreferencesChanged, show } from "cookie-though";
import defaultOptions from "./defaultOptions";
import shadowStyles from "./shadow-styles.scss?inline";
import styles from "./styles.scss?inline";
import deepMerge from "deepmerge";

function cookiesEnabled(prefs, category) {
    var tmp = prefs.cookieOptions.find((x) => x.id === category);
    if (tmp && tmp.isEnabled) return "granted";
    else return "denied";
}

function configStyles(theme) {
    // General stylesheet to add to page
    var styleSheet = document.createElement("style");
    styleSheet.innerHTML = styles;
    document.head.appendChild(styleSheet);

    // Shadow stylesheet for cookie though
    var shadowStyleSheet = document.createElement("style");
    shadowStyleSheet.innerHTML = shadowStyles;

    // properties need to be outside of the DOMContentLoaded or it doesn't work
    document
        .querySelector(".cookie-though")
        .shadowRoot.querySelector(".ct-collapse")
        .setAttribute("data-lenis-prevent", "");

    document.querySelector(".cookie-though").shadowRoot.appendChild(shadowStyleSheet);
    document.documentElement.style.setProperty(
        "--elevens-ct-primary-button-color",
        theme.primaryButtonColor
    );
    document.documentElement.style.setProperty(
        "--elevens-ct-primary-button-hover-color",
        theme.primaryButtonHoverColor
    );
    document.documentElement.style.setProperty(
        "--elevens-ct-primary-button-bg-color",
        theme.primaryButtonBgColor
    );
    document.documentElement.style.setProperty(
        "--elevens-ct-primary-button-bg-hover-color",
        theme.primaryButtonBgHoverColor
    );

    document.documentElement.style.setProperty("--elevens-ct-text-color", theme.textColor);
    document.documentElement.style.setProperty("--elevens-ct-bg-color", theme.bgColor);
}

function updateConsent(prefs) {
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
    console.log("Consent updated", consent);
}

// ------------------------------------------------------------- GO
const opts = deepMerge(defaultOptions, window.elevensCookieThough || {});
window.elevensMergedCookieOpions = opts;

//console.log("Attach event listeneres foor Cookiethough");

function startup() {
    console.log("Trying to initialize CookieThough", opts.config);

    // Initialize cookiethough
    init(opts.config);

    // After init
    configStyles(opts.theme);

    onPreferencesChanged((prefs) => {
        updateConsent(prefs);
    });

    // Does the cookie exist?
    if (document.cookie.indexOf("cookie-preferences") !== -1) {
        // There already was consent configured. Trigger the custom event.
        var prefs = getPreferences();
        if (prefs) {
            updateConsent(prefs);
        }
    }

    const cookiePrefsButton = document.querySelector("[data-cookie-though]");
    if (cookiePrefsButton) {
        cookiePrefsButton.addEventListener("click", (e) => {
            e.preventDefault();

            show();
        });
    }
}

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    console.log("Loading hasn't finished yet. Attach to DOMContentLoaded event.");
    document.addEventListener("DOMContentLoaded", startup);
} else {
    // `DOMContentLoaded` has already fired
    console.log("DOMContentLoaded has already fired. Run startup now.");
    startup();
}
