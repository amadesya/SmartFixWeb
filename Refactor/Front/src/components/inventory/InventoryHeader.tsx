import React from 'react';

interface InventoryHeaderProps {
    onAddPurchase: () => void;
    onAddType: () => void;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onAddPurchase, onAddType }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Запчасти</h2>
            <div className="flex gap-4">
                <button
                    onClick={onAddPurchase}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-smartfix-light dark:text-smartfix-darkest font-bold py-3 px-6 rounded-lg dark:hover:bg-opacity-80 transition-colors"
                >
                    Оформить закупку
                </button>
                <button
                    onClick={onAddType}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-smartfix-light dark:text-smartfix-darkest font-bold py-3 px-6 rounded-lg dark:hover:bg-opacity-80 transition-colors"
                >
                    Добавить новый тип запчасти
                </button>
            </div>
        </div>
    );
};

export default InventoryHeader;