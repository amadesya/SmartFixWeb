import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string; 
    className?: string;   
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Поиск...",
    className = ""
}) => {
    return (
        <div className={`flex flex-wrap items-center gap-4 md:gap-10 mb-4 md:mb-6 p-3 md:p-4 bg-white dark:bg-smartfix-dark rounded-lg border border-gray-200 dark:border-smartfix-medium shadow-sm dark:shadow-none ${className}`}>
            <div className="flex-1">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-gray-50 dark:bg-smartfix-darker p-1.5 md:p-2 rounded-lg border border-gray-200 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-sm md:text-base text-gray-900 dark:text-smartfix-lightest"
                />
            </div>
        </div>
    );
};

export default SearchInput;