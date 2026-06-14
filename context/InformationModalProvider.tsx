import { InformationModal } from '~/components/InformationModal'
import { createContext, useState, ReactNode } from 'react'

interface ShowModalParams {
  title: string
  description: string
  level?: 'info' | 'warning' | 'error'
  onConfirm?: () => void
  onCancel?: () => void
}

interface InfoModalContextType {
  showModal: (params: ShowModalParams) => void
  closeModal: () => void
}

export const InfoModalContext = createContext<InfoModalContextType | undefined>(undefined)

export const InformationModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState<ShowModalParams>({
    title: '',
    description: '',
    level: 'info',
  })

  const showModal = (params: ShowModalParams) => {
    setModalData({
      title: params.title,
      description: params.description,
      level: params.level || 'info',
      onConfirm: params.onConfirm,
      onCancel: params.onCancel,
    })
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => {
      setModalData(prev => ({ ...prev, onConfirm: undefined, onCancel: undefined }))
    }, 300)
  }

  const handleConfirm = () => {
    if (modalData.onConfirm) {
      modalData.onConfirm()
    }
    closeModal()
  }

  const handleCancel = () => {
    if (modalData.onCancel) {
      modalData.onCancel()
    }
    closeModal()
  }

  return (
    <InfoModalContext value={ { showModal, closeModal } }>
      { children }

      <InformationModal
        isOpen={ isOpen }
        onOpenChange={ (open) => {
          if (!open) {
            closeModal()
          }
        } }
        title={ modalData.title }
        description={ modalData.description }
        level={ modalData.level }
        onConfirm={ handleConfirm }
        onCancel={ modalData.onCancel ? handleCancel : undefined }
      />
    </InfoModalContext>
  )
}
