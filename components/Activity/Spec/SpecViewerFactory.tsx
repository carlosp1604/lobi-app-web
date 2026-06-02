import { TeamParticipantsViewer } from "~/components/Activity/Spec/TeamParticipantsViewer";
import { IndividualParticipantsViewer } from "~/components/Activity/Spec/IndividualParticipantsViewer";
import {
  ActivitySpecDto,
  IndividualParticipantsSpecDto,
  TeamParticipantsSpecDto
} from "~/types/activity/dto/config/spec/SpecDto";

export class SpecViewerFactory {
  public static getComponent(spec: ActivitySpecDto): React.ReactNode | null {
    if (!spec) {
      return null;
    }

    switch (spec.name) {
      case 'individual_participants':
        return <IndividualParticipantsViewer spec={spec as IndividualParticipantsSpecDto} />;

      case 'team_participants':
        return <TeamParticipantsViewer spec={spec as TeamParticipantsSpecDto} />;

      default:
        console.warn(`[ParticipantsViewerFactory] Unhandled participants config type: ${(spec as any).type}`);
        return null;
    }
  }
}
