export default {
    theme: {
        primaryButtonColor: "#ffffff",
        primaryButtonHoverColor: "#000000",
        primaryButtonBgColor: "#000000",
        primaryButtonBgHoverColor: "#ffffff",
        textColor: "#000000",
    },
    config: {
        policies: [
            {
                id: "essential",
                label: "Essenti\u00eble Cookies",
                description:
                    "Noodzakelijke cookies helpen een website bruikbaarder te maken, door basisfuncties als paginanavigatie en toegang tot beveiligde gedeelten van de website mogelijk te maken. Zonder deze cookies kan de website niet naar behoren werken.",
                category: "essential",
            },
            {
                id: "preferences",
                label: "Voorkeuren",
                description:
                    "Voorkeurscookies zorgen ervoor dat een website informatie kan onthouden die van invloed is op het gedrag en de vormgeving van de website, zoals de taal van uw voorkeur of de regio waar u woont.",
                category: "preferences",
            },
            {
                id: "statistics",
                label: "Statistieken",
                category: "statistics",
                description:
                    "Statistische cookies helpen eigenaren van websites begrijpen hoe bezoekers hun website gebruiken, door anoniem gegevens te verzamelen en te rapporteren.",
            },
            {
                id: "marketing",
                label: "Marketing",
                category: "marketing",
                description:
                    "Marketingcookies worden gebruikt om bezoekers te volgen wanneer ze verschillende websites bezoeken. Hun doel is advertenties weergeven die zijn toegesneden op en relevant zijn voor de individuele gebruiker. Deze advertenties worden zo waardevoller voor uitgevers en externe adverteerders.",
            },
        ],
        essentialLabel: "Altijd",
        permissionLabels: {
            accept: "Accepteren",
            acceptAll: "Alles accepteren",
            decline: "Weigeren",
        },
        cookiePreferenceKey: "cookie-preferences",
        header: {
            title: "Cookies",
            subTitle: "",
            description: "We gebruiken cookies om je de beste ervaring mogelijk te bieden.",
        },
        cookiePolicy: { url: "/cookies", label: "Lees de volledige cookie-verklaring" },
        customizeLabel: "Wijzigen",
    },
};
