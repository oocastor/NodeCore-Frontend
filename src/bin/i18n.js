import { createI18n } from 'vue-i18n';
import VueCookies from 'vue-cookies'

// Sprachpakete importieren
import de from "../lang/de.json"
import en from "../lang/en.json"
import fr from "../lang/fr.json"
import es from "../lang/es.json"
import nl from "../lang/nl.json"

const messages = {
  en: en,
  de: de,
  fr: fr,
  es: es,
  nl: nl
};

const i18n = createI18n({
  locale: VueCookies.get("lang") || "en",
  fallbackLocale: 'en',
  messages
});

export default i18n;