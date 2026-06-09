import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

const Select: React.FC<SelectProps> = ({ label, children, className = '', ...props }) => {
    return (
        <div>
            {label && <label className="block text-gray-600 dark:text-smartfix-light mb-1 text-sm">{label}</label>}
            <select
                className={`w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-200 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest ${className}`}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

export default Select;