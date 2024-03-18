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

/*!
 * Deep merge two or more objects or arrays.
 * (c) 2023 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param   {*} ...objs  The arrays or objects to merge
 * @returns {*}          The merged arrays or objects
 */
function deepMerge(...objs) {
    /**
     * Get the object type
     * @param  {*}       obj The object
     * @return {String}      The object type
     */
    function getType(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }

    /**
     * Deep merge two objects
     * @return {Object}
     */
    function mergeObj(clone, obj) {
        for (let [key, value] of Object.entries(obj)) {
            let type = getType(value);
            if (
                clone[key] !== undefined &&
                getType(clone[key]) === type &&
                ["array", "object"].includes(type)
            ) {
                clone[key] = deepMerge(clone[key], value);
            } else {
                clone[key] = structuredClone(value);
            }
        }
    }

    // Create a clone of the first item in the objs array
    let clone = structuredClone(objs.shift());

    // Loop through each item
    for (let obj of objs) {
        // Get the object type
        let type = getType(obj);

        // If the current item isn't the same type as the clone, replace it
        if (getType(clone) !== type) {
            clone = structuredClone(obj);
            continue;
        }

        // Otherwise, merge
        if (type === "array") {
            clone = [...clone, ...structuredClone(obj)];
        } else if (type === "object") {
            mergeObj(clone, obj);
        } else {
            clone = obj;
        }
    }

    return clone;
}

function cookiesEnabled(prefs, category) {
    var tmp = prefs.cookieOptions.find((x) => x.id === category);
    if (tmp && tmp.isEnabled) return "granted";
    else return "denied";
}

const options = deepMerge({}, defaultOptions, window.elevensMergedCookieOpions);
window.elevensMergedCookieOpions = options;

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
