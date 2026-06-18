import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/hooks/useAuth'
import { SearchIcon } from 'lucide-react'
import { HowItWorksSection } from '~/components/HowItWorks'
import { toast } from 'sonner'

export const Landing = () => {
  const { t } = useTranslation('landing')
  const { status, setLoginOpen } = useAuth()

  return (
    <section className="flex flex-col gap-y-3 md:gap-y-6 items-center justify-center px-4 text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-primary mb-4">
        { t('landing_title') }
      </h1>
      <h2 className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
        { t('landing_description') }
      </h2>
      <div className="w-full max-w-md mb-12">
        <Link href="/activities/" className="block w-full">
          <div className="
            flex items-center w-full px-4 py-3 bg-background border border-input rounded-full shadow-sm
            hover:border-ring hover:ring-1 hover:ring-ring transition-all cursor-text text-muted-foreground text-left
          ">
            <SearchIcon className="w-5 h-5 mr-3 shrink-0" />
            <span className="truncate">
              { t('landing_search_placeholder') }
            </span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-2xl w-full max-w-md border">
        <p className="text-sm font-medium text-foreground">
          { t('landing_create_section_title') }
        </p>
        { status === 'unauthenticated' ? (
          <div className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full font-bold"
              onClick={ () => {
                toast.warning(t('common:login_to_perform_operation_title'))
                setLoginOpen(true)
              } }
            >
              { t('landing_create_section_button_title') }
            </Button>
          </div>
        ) : (
          <Link href="/activities/create/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full font-bold">
              { t('landing_create_section_button_title') }
            </Button>
          </Link>
        ) }
      </div>
      <HowItWorksSection />
    </section>
  )
}
