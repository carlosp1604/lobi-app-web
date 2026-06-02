export enum ValidActivityStatus {
  OPEN = 'open',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
}

export const participableStatus: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
  ValidActivityStatus.CONFIRMED,
  ValidActivityStatus.FINISHED
];

export const manageableStatus: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN
]

export const joinableStatus: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
  ValidActivityStatus.CONFIRMED
]

export const leaveableStatus: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
]
