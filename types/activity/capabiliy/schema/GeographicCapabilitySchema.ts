import { z } from "zod";
import { Translate } from "next-translate";
import { createCoordinateSchema } from "~/types/shared/CoordinatesSchema";
import { GeographicCapabilitySchemaDto } from "~/types/activity/dto/CapabilitySchemaDto";

const BaseCoordinateSchema = z.object({
  lat: z.string(),
  lng: z.string()
});

export const END_DEFAULT_VALUE = null
export const END_INIT_VALUE = { lat: '', lng: '' }

export const GeographicPointSchema = BaseCoordinateSchema;

export const GeographicRangeSchema = z.object({
  start: BaseCoordinateSchema,
  end: BaseCoordinateSchema.nullable()
});

export type GeographicPointDto = z.infer<typeof GeographicPointSchema>;
export type GeographicRangeDto = z.infer<typeof GeographicRangeSchema>;

export type GeographicCapabilityDto = GeographicPointDto | GeographicRangeDto;

export const createGeographicCapabilitySchema = (config: GeographicCapabilitySchemaDto, t: Translate) => {
  const coordinateSchema = createCoordinateSchema(t);

  if (config.type === 'geographic_point') {
    return coordinateSchema;
  }

  return z.object({
    start: coordinateSchema,
    end: coordinateSchema.nullable()
  });
};


export const getGeographicCapabilityDefaultValue = (config: GeographicCapabilitySchemaDto) => {
  if (config.type === 'geographic_point') {
    return { lat: '', lng: '' };
  }

  return {
    start: { lat: '', lng: '' },
    end: null
  };
};


export const formatGeographicCapabilityData = (
  data: GeographicCapabilityDto,
  config: GeographicCapabilitySchemaDto,
  t: Translate
): Array<string> => {
  const values: Array<string> = [];

  if (config.type === 'geographic_point') {
    const pointData = data as GeographicPointDto;
    values.push(t('geographic_point_summary_title', { lat: pointData.lat, lng: pointData.lng }));

    return values;
  }

  const rangeData = data as GeographicRangeDto;

  values.push(t('geographic_range_start_summary_title', { lat: rangeData.start.lat, lng: rangeData.start.lng }));

  if (rangeData.end && rangeData.end.lat && rangeData.end.lng) {
    values.push(t('geographic_range_end_summary_title', { lat: rangeData.end.lat, lng: rangeData.end.lng }));
  }

  return values;
};

export const buildGeographicCapabilityPayload = (
  data: GeographicCapabilityDto,
  config: GeographicCapabilitySchemaDto
) => {
  if (config.type === 'geographic_point') {
    return data;
  }


  const rangeData = data as GeographicRangeDto;
  const { start } = rangeData;

  const isEndValid = rangeData.end && rangeData.end.lat !== '' && rangeData.end.lng !== '';
  const end = isEndValid ? rangeData.end : null;

  return {
    start,
    end: end !== null ? end : start
  };
};
