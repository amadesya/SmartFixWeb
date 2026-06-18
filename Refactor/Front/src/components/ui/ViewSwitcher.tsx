import React from 'react';

interface ViewOption {
    id: string;
    label: string;
}

interface ViewSwitcherProps {
    options: ViewOption[];
    activeView: string;
    onChange: (id: string) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ options, activeView, onChange }) => {
    return (
        <div className="flex bg-white dark:bg-smartfix-darker p-1 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onChange(option.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeView === option.id
                            ? 'bg-[#cff0e7] text-[#196d4a]'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-smartfix-medium/20'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
