import { use } from 'react'
import { InfoModalContext } from '~/context/InformationModalProvider'

export function useInformationModal() {
  const context = use(InfoModalContext)

  if (context === undefined) {
    throw new Error('useInformationModal() can only be used inside of <InformationModalProvider />')
  }

  return context
}
