import React from 'react';

interface TabOption {
    id: string | number;
    label: string;
}

interface TabsProps {
    options: TabOption[];
    activeTab: string | number;
    onTabChange: (id: any) => void;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ options, activeTab, onTabChange, className }) => {
    return (
        // Используем логику filter-card (фон, бордеры, скругления)
        <div className={`${className} flex overflow-x-auto no-scrollbar gap-2 p-1 bg-white dark:bg-smartfix-darker rounded-lg border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none mb-4`}>
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onTabChange(option.id)}
                    className={`px-3 md:px-4 py-1.5 text-sm font-bold transition-all whitespace-nowrap rounded-lg ${activeTab === option.id
                            ? 'bg-[#cff0e7] text-[#196d4a] dark:bg-smartfix-medium dark:text-smartfix-lightest shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-smartfix-light/60 dark:hover:text-smartfix-light dark:hover:bg-smartfix-medium/20'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};