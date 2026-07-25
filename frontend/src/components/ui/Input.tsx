import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string; // Добавляем поддержку подсказки
}

const Input: React.FC<InputProps> = ({ label, helperText, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-gray-600 dark:text-smartfix-light mb-1 text-sm">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-200 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest ${className}`}
                {...props}
            />
            {/* Рендерим подсказку, если она передана */}
            {helperText && (
                <p className="mt-1 text-xs text-gray-500 dark:text-smartfix-light italic">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default Input;