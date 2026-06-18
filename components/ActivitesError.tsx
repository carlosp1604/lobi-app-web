import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Button } from '~/components/ui/button'
import { AlertCircle } from 'lucide-react'

export const ActivitiesError = () => {
  const { t } = useTranslation('activities')

  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-4 text-center mt-6 mx-auto max-w-4xl">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-red-500"/>
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
        { t('activities_error_title') }
      </h1>

      <p className="text-gray-500 max-w-md mx-auto mb-8 text-base md:text-lg">
        { t('activities_error_description') }
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <Button
          asChild
          className="h-12 px-8 text-base font-bold bg-brand-primary hover:bg-brand-primary/80 text-white"
        >
          <Link href="/activities/">
            { t('activities_error_search_button_title') }
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-12 px-8 text-base font-bold text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          <Link href="/">
            { t('activities_error_home_button_title') }
          </Link>
        </Button>
      </div>
    </div>
  )
}
