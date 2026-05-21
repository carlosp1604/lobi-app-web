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
  logBuild: true,
  pages: {
    '*': [
      'common',
      'navigation',
      'api-errors',
      'next-errors'
    ],
    'rgx:^/auth': [
      'auth',
    ]
  },
}

module.exports = i18nConfig
