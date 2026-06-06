import { ReactNode } from 'react'
import { TeamParticipantsViewer } from '~/components/Activity/Spec/TeamParticipantsViewer'
import { IndividualParticipantsViewer } from '~/components/Activity/Spec/IndividualParticipantsViewer'
import {
  ActivitySpecDto,
  IndividualParticipantsSpecDto,
  TeamParticipantsSpecDto
} from '~/types/activity/dto/config/spec/SpecDto'

export class SpecViewerFactory {
  public static getComponent(spec: ActivitySpecDto): ReactNode | null {
    if (!spec) {
      return null
    }

    const specName = spec.name

    switch (spec.name) {
      case 'individual_participants':
        return (
          <IndividualParticipantsViewer
            spec={ spec as IndividualParticipantsSpecDto }
            key={ spec.name }
          />
        )

      case 'team_participants':
        return (
          <TeamParticipantsViewer
            spec={ spec as TeamParticipantsSpecDto }
            key={ spec.name }
          />
        )

      default:
        throw Error(`Viewer for spec ${specName} is not registered`)
    }
  }
}
