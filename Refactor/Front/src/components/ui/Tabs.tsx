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
        <div className={`${className} ui-switcher-container mb-4`}>
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onTabChange(option.id)}
                    className={`ui-switcher-button ${activeTab === option.id ? 'active' : 'inactive'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};