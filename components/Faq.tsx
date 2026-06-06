import useTranslation from 'next-translate/useTranslation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion'

export const Faq = () => {
  const { t } = useTranslation('faq')

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

  return (
    <div className="w-full mx-auto py-8 p-4">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          { t('faq_h1_title') }
        </h1>
        <p className="text-gray-500 text-base md:text-lg mb-6 leading-relaxed">
          { t('faq_description', { appName: t('common:app_name_title') }) }
        </p>
      </div>


      <Accordion type="single" collapsible className="w-full">
        { availableQuestions.map((question) => (
          <AccordionItem key={ question.id } value={ question.id }>
            <AccordionTrigger className="text-left font-medium text-gray-800">
              { t(`faq_${question.id}_question_title`, { ...question.qContext ?? {} }) }
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              { t(`faq_${question.id}_answer_title`, { ...question.aContext ?? {} }) }
            </AccordionContent>
          </AccordionItem>
        )) }
      </Accordion>
    </div>
  )
}
