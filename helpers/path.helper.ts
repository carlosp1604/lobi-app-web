export function isActivePath(targetHref: string, currentPathname: string): boolean {
  const cleanTarget = targetHref.split('?')[0]
  const cleanCurrent = currentPathname.split('?')[0]

  const normalize = (path: string) => path.replace(/\/$/, '')

  return normalize(cleanTarget) === normalize(cleanCurrent)
}
