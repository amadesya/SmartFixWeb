import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-200 dark:bg-smartfix-medium/10 text-gray-600 dark:text-smartfix-light hover:bg-gray-300 dark:hover:bg-smartfix-medium/20 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
            title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;