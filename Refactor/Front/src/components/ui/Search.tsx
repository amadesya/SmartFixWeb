import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const Search = ({ value, onChange, placeholder = "Поиск..." }: SearchProps) => {
    return (
        <div className="relative w-full mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-smartfix-light/40" />
            </div>

            {/* Поле ввода */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-10 md:h-11 pl-10 pr-4 
                bg-white dark:bg-smartfix-darker/50 text-sm 
                text-gray-900 dark:text-smartfix-lightest rounded-xl
                border border-gray-200 dark:border-smartfix-medium/20 focus:outline-none
                focus:border-emerald-500 dark:focus:border-smartfix-light focus:ring-2 
                focus:ring-emerald-500/20 dark:focus:ring-smartfix-dark/20 transition-all 
                dark:placeholder:text-smartfix-light/40 font-medium placeholder:text-gray-400 shadow-sm dark:shadow-none"
            />
        </div>
    );
};

export default Search;