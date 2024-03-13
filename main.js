import { getPreferences, init, onPreferencesChanged, show } from "cookie-though";
import defaultOptions from "./defaultOptions";
import shadowStyles from "./shadow-styles.scss?inline";
import styles from "./styles.scss?inline";

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function cookiesEnabled(prefs, category) {
    var tmp = prefs.cookieOptions.find((x) => x.id === category);
    if (tmp && tmp.isEnabled) return "granted";
    else return "denied";
}

const options = window.elevensCookieOptions
    ? mergeDeep(defaultOptions, window.elevensCookieThough)
    : defaultOptions;

// Initialize cookiethough
init(options.config);

// General stylesheet to add to page
var styleSheet = document.createElement("style");
styleSheet.innerHTML = styles;
document.head.appendChild(styleSheet);

// Shadow stylesheet for cookie though
var shadowStyleSheet = document.createElement("style");
shadowStyleSheet.innerHTML = shadowStyles;

document.querySelector(".cookie-though").shadowRoot.appendChild(shadowStyleSheet);

// add a css variable to the root
document.documentElement.style.setProperty(
    "--elevens-ct-primary-button-color",
    options.theme.primaryButtonColor
);
document.documentElement.style.setProperty(
    "--elevens-ct-primary-button-hover-color",
    options.theme.primaryButtonHoverColor
);
document.documentElement.style.setProperty(
    "--elevens-ct-primary-button-bg-color",
    options.theme.primaryButtonBgColor
);
document.documentElement.style.setProperty(
    "--elevens-ct-primary-button-bg-hover-color",
    options.theme.primaryButtonBgHoverColor
);

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
