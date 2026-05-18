const i18nConfig = {
  defaultLocale: 'es',
  locales: ['es'],
  loadLocaleFrom: (lang, ns) => {
    return new Promise((resolve, reject) => {
      import(`./public/locales/${lang}/${ns}.json`)
          .then((module) => resolve(module.default))
          .catch((exception) => reject((exception)))
    })
  },
  logBuild: false,
  pages: {
    '*': [
      'common',
    ],
  },

}

module.exports = i18nConfig