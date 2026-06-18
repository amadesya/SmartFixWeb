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
        <div className={`${className} flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-smartfix-medium/20 mb-1 gap-1 bg-white dark:bg-smartfix-darker/50 p-1 rounded-lg`}>
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onTabChange(option.id)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold transition-all whitespace-nowrap rounded-lg ${activeTab === option.id
                        ? 'bg-[#cff0e7] text-[#196d4a] dark:bg-smartfix-medium dark:text-smartfix-lightest'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-smartfix-light/60 dark:hover:text-smartfix-light dark:hover:bg-smartfix-medium/20'
                        }`}
            >
                    {option.label}
                </button>
            ))}
        </div>
    );
};