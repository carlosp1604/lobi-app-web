import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { Landing } from '~/components/Landing'

export default function Home() {
  const { t } = useTranslation('landing')

  const canonical = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/`

  return (
    <>
      <Seo
        title={ t('landing_page_title') }
        description={ t('landing_page_description') }
        canonicalUrl={ canonical }
        noIndex={ false }
        jsonLd={ {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': process.env.NEXT_PUBLIC_APP_NAME,
          'url': canonical,
          'description': t('landing_page_description'),
          'applicationCategory': 'SportsApplication',
          'operatingSystem': 'All',
        } }
      />

      <Landing />
    </>
  )
}
