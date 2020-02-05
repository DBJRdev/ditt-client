import moment from 'moment-timezone';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE } from '../config/envspecific';
import translations from './translations';

const translator = i18n;

moment.locale(LANGUAGE);

translator
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: LANGUAGE,
    resources: translations,
  });

export default translator;
