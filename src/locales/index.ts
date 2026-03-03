import { createI18n } from 'vue-i18n';
import en from './en.json';
import lo from './lo.json';

// Get saved language from localStorage or default to 'lo' (primary language)
const savedLocale = localStorage.getItem('locale') || 'lo';

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'lo',
  messages: {
    en,
    lo
  }
});

export default i18n;