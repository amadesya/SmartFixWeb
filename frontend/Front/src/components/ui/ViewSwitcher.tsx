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
        <div className="ui-switcher-container">
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onChange(option.id)}
                    className={`ui-switcher-button ${activeView === option.id ? 'active' : 'inactive'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
