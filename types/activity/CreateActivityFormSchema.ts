import { z } from "zod";
import { Translate } from "next-translate";
import { CapabilitySchemaDto } from "~/types/activity/dto/CapabilitySchemaDto";
import { SportDetailsQueryDto } from "~/types/activity/dto/GetSportsQueryResponseDto";
import { createMultipleChoiceSchema } from "~/types/activity/capabiliy/schema/MultipleChoiceCapabilitySchema";
import { createTeamParticipantsSpecSchema } from "~/types/activity/spec/schema/TeamParticipantsSpecSchema";
import { createGeographicCapabilitySchema } from "~/types/activity/capabiliy/schema/GeographicCapabilitySchema";
import { createMagnitudeRangeCapabilitySchema } from "~/types/activity/capabiliy/schema/MagnitudeRangeCapabilitySchema";
import { createIndividualParticipantsSpecSchema } from "~/types/activity/spec/schema/IndividualParticipantsSpecSchema";
import { IndividualParticipantsSpecSchemaDto, TeamParticipantsSpecSchemaDto } from "~/types/activity/dto/SpecSchemaDto";
import {
  ActivityDescriptionRegex,
  ActivityTitleForbiddenRegex, MAX_ACTIVITY_DESCRIPTION_LENGTH, MAX_ACTIVITY_TITLE_LENGTH, MAX_FUTURE_DAYS,
  MIN_ACTIVITY_DESCRIPTION_LENGTH, MIN_ACTIVITY_TITLE_LENGTH, MIN_MARGIN_MINUTES
} from "~/helpers/input.helper";

export const createCreateActivityFormSchema = (
  selectedSport: SportDetailsQueryDto | null,
  activeCapabilities: Array<string>,
  t: Translate,
) => {
  const baseSchema = {
    title: z
      .string()
      .min(MIN_ACTIVITY_TITLE_LENGTH, { error: t('activity_title_too_short_message_title', { minLength: MIN_ACTIVITY_TITLE_LENGTH })})
      .max(MAX_ACTIVITY_TITLE_LENGTH, { error: t('activity_title_too_long_message_title', { maxLength: MAX_ACTIVITY_TITLE_LENGTH })})
      .refine((value) => !ActivityTitleForbiddenRegex.test(value), {
        message: t('activity_title_invalid_characters_message_title')
      }),
    sportId: z.uuid(),
    scheduledDate: z.iso.datetime({ error: t('activity_date_date_is_required_message_title')})
      .superRefine((val, ctx) => {
        const now = new Date();

        const minDate = new Date(now.getTime() + MIN_MARGIN_MINUTES * 60 * 1000);
        const maxDate = new Date(now.getTime() + MAX_FUTURE_DAYS * 24 * 60 * 60 * 1000);
        const selectedDate = new Date(val);

        if (selectedDate < minDate) {
          ctx.addIssue({
            code: 'custom',
            message: t('activity_date_x_message_title')
          });
        }

        if (selectedDate > maxDate) {
          ctx.addIssue({
            code: 'custom',
            message: t('activity_date_y_message_title')
          });
        }
      }),
    description: z.string()
      .refine((value) => ActivityDescriptionRegex.test(value), {
        message: t('activity_description_invalid_value_title', {
          min: MIN_ACTIVITY_DESCRIPTION_LENGTH,
          max: MAX_ACTIVITY_DESCRIPTION_LENGTH
        })
      })
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    capabilities: z.record(z.string(), z.string()).optional(),
    specs: z.record(z.string(), z.string()).optional(),
  }

  if (!selectedSport) {
    return z.object(baseSchema)
  }

  const specsShape = Object.keys(selectedSport.config.specs).reduce((acc, key) => {
    if (key === 'individual_participants') {
      const spec = selectedSport.config.specs[key] as IndividualParticipantsSpecSchemaDto;

      acc[key] = createIndividualParticipantsSpecSchema(spec, t)
    }
    if (key === 'team_participants') {
      const spec = selectedSport.config.specs[key] as TeamParticipantsSpecSchemaDto;

      acc[key] = createTeamParticipantsSpecSchema(spec, t)
    }
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  const capabilitiesShape = Object.keys(selectedSport.config.capabilities).reduce((acc, key) => {
    const capability = selectedSport.config.capabilities[key] as CapabilitySchemaDto;

    if (!activeCapabilities.includes(key)) {
      return acc;
    }

    if (capability.type === 'scalar_point' || capability.type === 'scalar_range') {
      acc[key] = createMagnitudeRangeCapabilitySchema(capability, t);
    }
    if (capability.type === 'geographic_point' || capability.type === 'geographic_range') {
      acc[key] = createGeographicCapabilitySchema(capability, t);
    }
    if (capability.type === 'multiple_choice') {
      acc[key] = createMultipleChoiceSchema(capability, t)
    }

    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  return z.object({
    ...baseSchema,
    specs: z.object(specsShape).optional(),
    capabilities: z.object(capabilitiesShape).optional()
  });
}
