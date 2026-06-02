import {
  RulerIcon,
  MountainIcon,
  TimerIcon,
  ActivityIcon,
  FlameIcon,
  InfoIcon,
  TrendingUpIcon
} from 'lucide-react';
import useTranslation from "next-translate/useTranslation";
import {MagnitudeDto, MagnitudeRangeCapabilityDto} from "~/types/activity/dto/config/capability/CapabilityDto";

const getCapabilityIcon = (name: string) => {
  switch (name) {
    case 'distance':
      return <RulerIcon className="w-5 h-5 text-blue-500" />;
    case 'altitude':
      return <MountainIcon className="w-5 h-5 text-emerald-500" />;
    case 'duration':
    case 'pace':
      return <TimerIcon className="w-5 h-5 text-orange-500" />;
    case 'speed':
      return <ActivityIcon className="w-5 h-5 text-red-500" />;
    case 'rpe':
      return <FlameIcon className="w-5 h-5 text-rose-500" />;
    default:
      return <InfoIcon className="w-5 h-5 text-muted-foreground" />;
  }
};

// Helper interno para formatear cualquier magnitud extrayendo el unit correcto
const formatMagnitude = (mag: MagnitudeDto) => {
  return mag.formatted?.[mag.unit]?.short || `${mag.value} ${mag.unit}`;
};

export interface MagnitudeRangeCapabilityViewerProps {
  capability: MagnitudeRangeCapabilityDto;
}

export const MagnitudeRangeCapabilityViewer = ({ capability }: MagnitudeRangeCapabilityViewerProps) => {
  const { t } = useTranslation('activities');
  const { name, data } = capability;

  // 1. Formateamos las primitivas
  const startStr = formatMagnitude(data.start);
  const endStr = formatMagnitude(data.end);
  const avgStr = data.average ? formatMagnitude(data.average) : null;

  return (
    <div className="flex items-center gap-4 p-4 bg-card border rounded-xl shadow-sm transition-all hover:shadow-md">
      {/* Icono */}
      <div className="p-2.5 bg-secondary/50 rounded-lg shrink-0">
        {getCapabilityIcon(name)}
      </div>

      {/* Contenedor de Textos */}
      <div className="flex flex-col w-full">
        {/* Título de la capability (ej: RITMO, ALTITUD) */}
        <span className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">
          {t(`capability_${name}_title`)}
        </span>

        {/* Lógica de renderizado condicional según tus reglas */}
        <div className="flex flex-col">
          {data.isSingleValue ? (
            // CASO 1: Un solo valor (start y end son iguales)
            <span className="text-lg font-semibold text-foreground leading-tight">
              {startStr}
            </span>
          ) : (
            // CASOS 2 y 3: Rango de valores (son diferentes)
            <>
              <span className="text-lg font-semibold text-foreground leading-tight">
                {startStr} <span className="text-muted-foreground font-normal mx-1">-</span> {endStr}
              </span>

              {/* CASO 3: Tienen promedio (Renderizamos el 3º valor como subtexto) */}
              {avgStr && (
                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground font-medium bg-secondary/40 w-fit px-2 py-0.5 rounded">
                  <TrendingUpIcon className="w-3.5 h-3.5" />
                  <span>
                    {t('activity_capability_average_label', { defaultValue: 'Medio' })}: {avgStr}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
