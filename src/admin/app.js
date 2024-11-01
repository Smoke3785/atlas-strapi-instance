import iliad_strapi_logo from "./extensions/iliad_strapi.png";
import iliad_atlas_logo from "./extensions/iliad_atlas.png";

const testing2 = [];

const config = {
  auth: {
    logo: iliad_atlas_logo,
  },
  menu: {
    logo: iliad_atlas_logo,
  },
  head: {
    favicon: iliad_atlas_logo,
  },
  tutorials: false,
  notifications: {
    releases: false,
  },
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
  theme: {
    light: {},
  },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
