// src/components/Modal.jsx
import { h } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { ModalContext } from "../contexts/ModalContext";

export default function Modal() {
  const { isOpen, closeModal, modalMessage } = useContext(ModalContext);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        closeModal();
      }, 1000); // Close after 1 second
    }
    return () => clearTimeout(timer); // Cleanup timer on component unmount or if isOpen changes
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-sm w-full">
        <p class="mb-4">{modalMessage}</p>
        {/* Button removed as per request */}
      </div>
    </div>
  );
}
