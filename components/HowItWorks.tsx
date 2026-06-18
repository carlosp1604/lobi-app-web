import useTranslation from 'next-translate/useTranslation'
import { ActivityCardMock } from '~/components/ActivityCardMock'
import { MapPinIcon, TrophyIcon, MousePointerClickIcon } from 'lucide-react'

export const HowItWorksSection = () => {
  const { t } = useTranslation('landing'
  )

  return (
    <section className="py-16 px-4 w-full bg-muted/30 rounded-2xl">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="
            w-full max-w-sm pointer-events-none shadow-xl rounded-xl transform rotate-[-2deg]
            hover:rotate-0 transition-transform duration-300"
          >
            <ActivityCardMock />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-8">
          <h3 className="
            text-3xl sm:text-4xl font-bold text-foreground text-center md:text-left whitespace-pre-line
          ">
            { t('landing_how_it_works_title') }
          </h3>

          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="
                flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0 mt-1
               ">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  { t('landing_step_1_title') }
                </h4>
                <p className="text-muted-foreground mt-1">
                  { t('landing_step_1_description') }
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="
                flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0 mt-1
                ">
                <TrophyIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  { t('landing_step_2_title') }
                </h4>
                <p className="text-muted-foreground mt-1">
                  { t('landing_step_2_description') }
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="
                flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0 mt-1
                ">
                <MousePointerClickIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  { t('landing_step_3_title') }
                </h4>
                <p className="text-muted-foreground mt-1">
                  { t('landing_step_3_description') }
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
