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
      'auth',
      'navigation',
      'api-errors',
      'next-errors'
    ],
    'rgx:^/user': [
      'user',
    ]
  },
}

module.exports = i18nConfig
