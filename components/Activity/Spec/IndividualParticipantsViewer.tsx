import useTranslation from "next-translate/useTranslation";
import { UserIcon } from "lucide-react";
import { IndividualParticipantsSpecDto } from "~/types/activity/dto/config/spec/SpecDto";

interface IndividualParticipantsViewerProps {
  spec: IndividualParticipantsSpecDto
}

export const IndividualParticipantsViewer = ({ spec }: IndividualParticipantsViewerProps) => {
  const { t } = useTranslation('activities');
  const { minPlayers, maxPlayers } = spec.data;

  const isExact = minPlayers === maxPlayers;

  return (
    <div className="flex items-center gap-4 p-4 bg-card border rounded-xl shadow-sm transition-all hover:shadow-md">
      <div className="p-2.5 bg-secondary/50 rounded-lg shrink-0">
        <UserIcon className="w-5 h-5 text-blue-500" />
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-muted-foreground uppercase mb-0.5">
          {t('activity_details_specs_individual_participants_title')}
        </span>
        <span className="font-medium text-foreground mb-1">
          {t('activity_details_specs_individual_participants_modality_title')}
        </span>
        <span className="font-bold text-foreground leading-tight">
          {isExact
            ? t('activity_details_specs_individual_participants_exact_count_title', { count: maxPlayers })
            : t('activity_details_specs_individual_participants_min_max_count_title', { min: minPlayers, max: maxPlayers })
          }
        </span>
      </div>
    </div>
  );
};
