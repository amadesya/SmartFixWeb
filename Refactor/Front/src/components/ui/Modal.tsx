import React, { useEffect } from 'react';
import { createPortal } from 'react-dom'; // Импортируем портал
import {Button} from '@/components/ui/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  // Блокируем скролл body при открытии модалки
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/80 z-[9999] flex justify-center items-center p-4 backdrop-blur-sm dark:backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-smartfix-darker/75 w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 dark:border-smartfix-medium/30 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-smartfix-medium/10 bg-gray-50 dark:bg-smartfix-dark">
          <h3 className="text-xl font-bold text-gray-900 dark:text-smartfix-lightest leading-none">
            {title}
          </h3>

          <Button
            variant="secondary"
            onClick={onClose}
            className="!p-1.5 !h-auto text-gray-500 dark:text-smartfix-light hover:text-gray-900 dark:hover:text-white transition-colors border-transparent hover:bg-gray-200 dark:hover:bg-smartfix-medium/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Контент */}
        <div className="p-6 max-h-[85vh] md:max-h-[75vh] overflow-y-auto text-gray-700 dark:text-smartfix-light custom-scrollbar">
          {children}
        </div>

        {/* Футер */}
        {footer && (
          <div className="p-6 border-t border-gray-200 dark:border-smartfix-medium/10 flex justify-end gap-3 bg-gray-50 dark:bg-smartfix-dark/30">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body // Цель портала
  );
};

export default Modal;