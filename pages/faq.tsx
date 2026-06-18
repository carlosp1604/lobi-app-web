import useTranslation from 'next-translate/useTranslation'
import { Faq } from '~/components/Faq'
import { Seo } from '~/components/Seo'

export default function FaqPage() {
  const { t } = useTranslation('faq')

  const canonical = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/faq/`

  const availableQuestions = [
    { id: 'whats_app', qContext: { appName: t('common:app_name_title') }, aContext: { appName: t('common:app_name_title') } },
    { id: 'how_to_signup', qContext: { appName: t('common:app_name_title') } },
    { id: 'is_secure' },
    { id: 'how_to_search_activities' },
    { id: 'how_to_join_an_activity' },
    { id: 'how_to_create_activities' },
    { id: 'what_if_dont_attend' },
    { id: 'how_levels_work' },
    { id: 'is_that_all', aContext: { appName: t('common:app_name_title') } },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': availableQuestions.map((question) => ({
      '@type': 'Question',
      'name': t(`faq_${question.id}_question_title`, { ...question.qContext ?? {} }),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': t(`faq_${question.id}_answer_title`, { ...question.aContext ?? {} }),
      },
    })),
  }

  return (
    <>
      <Seo
        title={ t('faq_page_title') }
        description={ t('faq_page_description', { appName: t('common:app_name_title') }) }
        canonicalUrl={ canonical }
        noIndex={ false }
        jsonLd={ faqJsonLd }
      />
      <Faq />
    </>
  )
}
