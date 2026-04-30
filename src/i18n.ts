import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      page: {
        title: 'Advisor Listings',
        subtitle: 'Find an advisor and check their live call and chat availability.',
        viewModeAria: 'Select list rendering mode',
        pagination: 'Pagination',
        infinite: 'Infinite Scroll',
        paginationAria: 'Advisor pagination',
        languageLabel: 'Language',
      },
      actions: {
        callNow: 'CALL NOW',
        callLater: 'CALL LATER',
        chatNow: 'CHAT NOW',
        chatLater: 'CHAT LATER',
      },
      a11y: {
        callNow: 'Call now',
        callLater: 'Call later',
        chatNow: 'Chat now',
        chatLater: 'Chat later',
        virtualList: 'Virtualized advisor listings',
      },
      states: {
        loadingAria: 'Loading advisors',
        empty: 'No advisors found.',
        error: 'Something went wrong while loading advisors.',
      },
    },
  },
  es: {
    translation: {
      page: {
        title: 'Listado de Asesores',
        subtitle: 'Encontrá un asesor y revisá su disponibilidad en vivo para llamada y chat.',
        viewModeAria: 'Seleccionar modo de listado',
        pagination: 'Paginación',
        infinite: 'Scroll Infinito',
        paginationAria: 'Paginación de asesores',
        languageLabel: 'Idioma',
      },
      actions: {
        callNow: 'LLAMAR AHORA',
        callLater: 'LLAMAR LUEGO',
        chatNow: 'CHATEAR AHORA',
        chatLater: 'CHATEAR LUEGO',
      },
      a11y: {
        callNow: 'Llamar ahora',
        callLater: 'Llamar luego',
        chatNow: 'Chatear ahora',
        chatLater: 'Chatear luego',
        virtualList: 'Listado virtualizado de asesores',
      },
      states: {
        loadingAria: 'Cargando asesores',
        empty: 'No se encontraron asesores.',
        error: 'Ocurrió un error al cargar asesores.',
      },
    },
  },
} as const;

const supportedLanguages = ['en', 'es'] as const;
const browserLanguage =
  typeof navigator !== 'undefined' ? navigator.language.toLowerCase().split('-')[0] : 'en';
const initialLanguage = supportedLanguages.includes(browserLanguage as (typeof supportedLanguages)[number])
  ? browserLanguage
  : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
