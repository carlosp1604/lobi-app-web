import Big from 'big.js'

export const padZero = (value: string | number) => {
  if (value === '' || value === null || value === undefined) {
    return ''
  }

  return value.toString().padStart(2, '0')
}

export const formatDuration = (totalSeconds: Big): string => {
  const hours = totalSeconds.div(3600).round(0, 0).toString()
  const minutes = totalSeconds.mod(3600).div(60).round(0, 0).toString()
  const seconds = totalSeconds.mod(60).round(0, 0).toString()

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
}

export const formatPace = (totalSeconds: Big): string => {
  const minutes = totalSeconds.div(60).round(0, 0).toString()
  const seconds = totalSeconds.mod(60).round(0, 0).toString()

  return `${padZero(minutes)}:${padZero(seconds)}`
}
