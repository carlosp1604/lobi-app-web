import { createContext, useState, ReactNode } from "react";
import {InformationModal} from "~/components/InformationModal";

type ShowModalParams = {
  title: string;
  description: string;
  level?: "info" | "warning" | "error";
};

interface InfoModalContextType {
  showModal: (params: ShowModalParams) => void;
  closeModal: () => void;
}

export const InfoModalContext = createContext<InfoModalContextType | undefined>(undefined);

export const InformationModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ShowModalParams>({
    title: "",
    description: "",
    level: "info",
  });

  const showModal = (params: ShowModalParams) => {
    setModalData({
      title: params.title,
      description: params.description,
      level: params.level || "info",
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <InfoModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      <InformationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={modalData.title}
        description={modalData.description}
        level={modalData.level}
      />
    </InfoModalContext.Provider>
  );
};
