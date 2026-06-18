import useTranslation from 'next-translate/useTranslation'
import { Badge } from '~/components/ui/badge'
import { ShieldIcon, Users } from 'lucide-react'

export const ActivityCardMock = () => {
  const { t } = useTranslation('landing')

  return (
    <div className="flex flex-col gap-3 border-2 border-border rounded-xl p-4 shadow-sm bg-card text-card-foreground">
      <div className="flex justify-between items-center">
        <Badge className="
          bg-green-100 text-green-700 hover:bg-green-100 px-2 py-3 rounded-full uppercase border-none
        ">
          { t('landing_mock_status_open') }
        </Badge>
        <Badge className="px-2 py-3 rounded-full uppercase" variant="outline">
          { t('landing_mock_sport') }
        </Badge>
      </div>

      <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900">
        { t('landing_mock_activity_title') }
      </h3>
      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
        { t('landing_mock_activity_description') }
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        <div className="
          flex items-center gap-1.5 text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg text-sm font-medium
        ">
          <Users className="w-4 h-4 text-primary" />
          <span>
            { t('landing_mock_participants') }
          </span>
        </div>

        <div className="
          flex items-center gap-1.5 bg-purple-50 text-purple-500 px-2.5 py-1.5 rounded-lg text-sm font-medium
        ">
          <ShieldIcon className="w-4 h-4 text-purple-500" />
          <span>
            { t('landing_mock_team_config') }
          </span>
        </div>
      </div>

      <div className="pt-3 flex justify-between items-center text-sm border-t border-gray-100">
        <span className="text-gray-800 font-semibold capitalize">
          { t('landing_mock_date') }
        </span>
        <div className="flex gap-2 items-center">
          <span className="text-sm tracking-wide text-gray-500 font-normal">
            { t('landing_mock_organizer') }
          </span>
        </div>
      </div>
    </div>
  )
}
