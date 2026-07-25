import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, className = '', ...props }) => {
    return (
        <div>
            {label && <label className="block text-gray-600 dark:text-smartfix-light mb-1 text-sm">{label}</label>}
            <textarea
                className={`w-full bg-white dark:bg-smartfix-dark p-2 rounded-lg border border-gray-200 dark:border-smartfix-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-smartfix-light text-gray-900 dark:text-smartfix-lightest resize-y ${className}`}
                {...props}
            />
        </div>
    );
};

export default Textarea;