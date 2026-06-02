import { useContext } from "react";
import { InfoModalContext } from "~/context/InformationModalProvider";

export function useInformationModal() {
  const context = useContext(InfoModalContext);

  if (context === undefined) {
    throw new Error('useInformationModal() can only be used inside of <InformationModalProvider />');
  }

  return context;
}
