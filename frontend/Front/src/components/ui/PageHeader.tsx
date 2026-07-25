import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline'; 

export interface HeaderAction {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
}

interface PageHeaderProps {
    title: string;
    actions?: HeaderAction[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-smartfix-darkest dark:text-smartfix-lightest">{title}</h2>

            {actions && actions.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="btn-page-header"
                        >
                            {action.label === "Добавить услугу"}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};