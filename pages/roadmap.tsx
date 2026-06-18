import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { Roadmap } from '~/components/Roadmap'

export default function RoadmapPage() {
  const { t } = useTranslation('roadmap')

  const canonical = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/roadmap/`

  return (
    <>
      <Seo
        title={ t('roadmap_page_title') }
        description={ t('roadmap_page_description') }
        canonicalUrl={ canonical }
        noIndex={ false }
      />
      <Roadmap />
    </>
  )
}
