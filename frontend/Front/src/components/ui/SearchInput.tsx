import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Поиск...", className = "" }) => {
    return (
        <div className={`filter-card ${className}`}>
            <label className="text-sm font-medium text-gray-600 dark:text-smartfix-light whitespace-nowrap">
                Поиск:
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="filter-input flex-1"
            />
        </div>
    );
};

export default SearchInput;