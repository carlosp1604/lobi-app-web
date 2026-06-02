import { SportDetailsQueryDto } from '~/types/activity/dto/GetSportsQueryResponseDto';
import { TeamParticipantsSpecInput } from "~/components/Forms/Input/TeamParticipantsSpecInput";
import { FieldGroup, FieldSeparator } from '~/components/ui/field';
import { IndividualParticipantsSpecInput } from "~/components/Forms/Input/IndividualParticipantsSpecInput";

interface ActivitySpecsStepProps {
  sport: SportDetailsQueryDto;
}

export function CreateActivitySpecsStep({ sport }: ActivitySpecsStepProps) {
  return (
    <FieldGroup>
      {Object.keys(sport.config.specs).map((key, index) => {
        if (key === 'team_participants') {
          return (
            <>
              <TeamParticipantsSpecInput
                key={key}
                name={`specs.${key}`}
              />
              {(index + 1) < Object.keys(sport.config.specs).length && <FieldSeparator />}
            </>

          );
        }

        if (key === 'individual_participants') {
          return (
            <>
              <IndividualParticipantsSpecInput
                key={key}
                name={`specs.${key}`}
              />
              {(index + 1) < Object.keys(sport.config.specs).length && <FieldSeparator />}
            </>
          );
        }
      })}
    </FieldGroup>
  );
}
