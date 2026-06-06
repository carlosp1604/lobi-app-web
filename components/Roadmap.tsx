import useTranslation from 'next-translate/useTranslation'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '~/lib/utils'

const roadmapItems = [
  {
    id: 'launch',
    date: 'june_2026_date_title',
    title: 'june_2026_title',
    status: 'current',
    features: [
      'june_2026_feature_1_title',
      'june_2026_feature_2_title',
      'june_2026_feature_3_title',
      'june_2026_feature_4_title',
      'june_2026_feature_5_title',
      'june_2026_feature_6_title',
    ],
  },
  {
    id: 'q4-2026',
    date: 'q4_2026_date_title',
    title: 'q4_2026_title',
    status: 'upcoming',
    features: [
      'q4_2026_feature_1_title',
      'q4_2026_feature_2_title',
      'q4_2026_feature_3_title',
      'q4_2026_feature_4_title',
      'q4_2026_feature_5_title',
      'q4_2026_feature_6_title',
    ],
  },
  {
    id: 'q1-2027',
    date: 'q1_2027_date_title',
    title: 'q1_2027_title',
    status: 'upcoming',
    features: [
      'q1_2027_feature_1_title',
      'q1_2027_feature_2_title',
      'q1_2027_feature_3_title',
      'q1_2027_feature_4_title',
      'q1_2027_feature_5_title',
    ],
  },
  {
    id: 'q2-2027',
    date: 'q2_2027_date_title',
    title: 'q2_2027_title',
    status: 'upcoming',
    features: [
      'q2_2027_feature_1_title',
      'q2_2027_feature_2_title',
      'q2_2027_feature_3_title',
      'q2_2027_feature_4_title',
    ],
  },
  {
    id: 'easter-egg',
    date: 'easter_egg_date_title',
    title: 'easter_egg_title',
    status: 'tentative',
    features: [],
  },
]

export const Roadmap = () => {
  const { t } = useTranslation('roadmap')

  return (
    <div className="w-full mx-auto py-8 px-4">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          { t('roadmap_h1_title') }
        </h1>
        <p className="text-gray-500 text-base md:text-lg mb-6 leading-relaxed">
          { t('roadmap_description') }
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute left-[19px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-brand-primary
            via-brand-primary/40 to-transparent"
          aria-hidden="true"
        />

        <div className="space-y-12">
          { roadmapItems.map((item) => {
            const isCurrent = item.status === 'current'
            const isTentative = item.status === 'tentative'

            return (
              <div
                key={ item.id }
                className={ `relative pl-14 transition-opacity ${isTentative ? 'opacity-40' : 'opacity-100'}` }
              >
                <div className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center bg-background">
                  { isCurrent ? (
                    <CheckCircle2 className="h-7 w-7 text-brand-primary fill-brand-primary/10"/>
                  ) : (
                    <Circle className={ `h-6 w-6 bg-background ${isTentative ? 'text-gray-200' : 'text-gray-300'}` }/>
                  ) }
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-3">
                  <h3 className={ `text-xl font-bold ${isCurrent ? 'text-brand-primary' : 'text-gray-800'}` }>
                    { t(item.date) }
                  </h3>
                  <span className="text-gray-500 font-medium hidden sm:inline">—</span>
                  <span className="text-gray-600 font-medium text-lg">
                    { t(item.title) }
                    { isTentative && <span className="ml-1 text-brand-primary">*</span> }
                  </span>
                </div>
                <ul className="space-y-2 mt-3">
                  { item.features.map((feature, featureIndex) => (
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    <li key={ `${item.id}_feature_${featureIndex}` } className="flex items-start">
                      <span className={ cn(
                        'mr-2 mt-1.5 h-1.5 w-1.5 rounded-full shrink-0',
                        {
                          'bg-brand-primary': isCurrent,
                          'bg-gray-200': !isCurrent && isTentative,
                          'bg-gray-300': !isCurrent && !isTentative,
                        }
                      ) }
                      />
                      <span className={ isCurrent ? 'text-gray-800 font-medium' : 'text-gray-500' }>
                        { t(feature) }
                      </span>
                    </li>
                  )) }
                </ul>
              </div>
            )
          }) }
        </div>

        <div className="mt-12 pl-14 opacity-30 hover:opacity-100 transition-opacity duration-500">
          <div className="text-sm text-gray-500 font-medium italic">
            <span className="text-brand-primary font-bold not-italic mr-1">*</span>
            { t('easter_egg_quote_title') }
            <span className="block mt-2 text-xs text-gray-400 not-italic font-normal">
              { t('easter_egg_quote_bio_title') }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
