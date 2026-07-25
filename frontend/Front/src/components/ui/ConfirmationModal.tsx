import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-smartfix-darker rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-smartfix-medium/30">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-smartfix-medium/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 text-gray-600 dark:text-smartfix-light/80">
                    <p>{message}</p>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-smartfix-dark border-t border-gray-100 dark:border-smartfix-medium/20">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-smartfix-light hover:bg-gray-100 dark:hover:bg-smartfix-medium/20 rounded-lg transition-colors">
                        Отмена
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-sm">
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;