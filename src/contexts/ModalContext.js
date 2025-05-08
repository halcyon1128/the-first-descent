// src/contexts/ModalContext.js
import { h } from "preact";
import { createContext } from "preact";
import { useState } from "preact/hooks";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const openModal = (message) => {
    setModalMessage(message);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setModalMessage(''); // Clear message on close
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, modalMessage }}>
      {children}
    </ModalContext.Provider>
  );
}
