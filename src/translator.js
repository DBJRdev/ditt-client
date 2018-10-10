import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import { LANGUAGE } from '../config/envspecific';
import translations from './translations';

const translator = i18n;

translator
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    lng: LANGUAGE,
    resources: translations,
  });

export default translator;
