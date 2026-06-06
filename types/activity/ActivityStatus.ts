export enum ValidActivityStatus {
  OPEN = 'open',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  FINISHED = 'finished'
}

export const allStatuses: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
  ValidActivityStatus.CONFIRMED,
  ValidActivityStatus.FINISHED,
  ValidActivityStatus.CANCELLED,
]

export const participableStatuses: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
  ValidActivityStatus.CONFIRMED,
  ValidActivityStatus.FINISHED,
]

export const manageableStatuses: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
]

export const joinableStatuses: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
  ValidActivityStatus.CONFIRMED,
]

export const leaveableStatuses: Array<ValidActivityStatus> = [
  ValidActivityStatus.OPEN,
]

export const statusColorMap: Record<string, string> = {
  open: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50',
  confirmed: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50',
  cancelled: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50',
  finished: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
}

export const statusProgressColorMap: Record<string, string> = {
  open: 'bg-green-500',
  confirmed: 'bg-purple-500',
  cancelled: 'bg-red-900',
  finished: 'bg-sky-500',
}
