import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const Search: React.FC<SearchProps> = ({
    value,
    onChange,
    placeholder = "Поиск..."
}) => {
    return (
        <div className="relative w-full mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-smartfix-light/40" />
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="filter-input w-full pl-10 interactive-border focus:ring-0"
            />
        </div>
    );
};

export default Search;