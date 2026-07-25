import React from 'react';
import { Part, PartType } from '@/types';
import DataTable, { Column } from '@/components/ui/DataTable';
import { PencilIcon, TrashIcon } from '../ui/icons';

interface PartTypeTableProps {
    partTypes: PartType[];
    isLoading?: boolean;
    onDelete: (id: number) => void;
    onEdit: (partTypes: PartType) => void;
}

export const PartTypeTable: React.FC<PartTypeTableProps> = ({
    partTypes: partTypes,
    isLoading = false,
    onDelete,
    onEdit
}) => {
    const columns: Column<PartType>[] = [
        {
            header: 'ID',
            className: 'w-16',
            render: (partTypes) => <span className="text-gray-900 dark:text-smartfix-lightest">{partTypes.id}</span>
        },
        {
            header: 'Название',
            render: (partTypes) => (
                <span className="font-medium text-gray-900 dark:text-smartfix-lightest">{partTypes.name}</span>
            )
        },
        {
            header: 'Действия',
            className: 'w-10',
            render: (partTypes) => (
                <div className="flex justify-end items-center gap-2">
                    <button
                        onClick={() => onEdit(partTypes)}
                        className="bg-gray-100 dark:bg-smartfix-darkest p-2 rounded-lg text-blue-500 dark:text-blue-400 hover:text-white dark:hover:text-white hover:bg-blue-600 transition-all shadow-sm dark:shadow-lg"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(partTypes.id)}
                        className="bg-gray-100 dark:bg-smartfix-darkest p-2 rounded-lg text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white hover:bg-red-600 transition-all shadow-sm dark:shadow-lg"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-smartfix-darker rounded-xl shadow-sm border border-gray-200 dark:border-smartfix-medium/30 overflow-hidden">
            <DataTable
                data={partTypes}
                columns={columns}
                isLoading={isLoading}
                rowKey={(partTypes) => partTypes.id}
                emptyMessage="Типы запчастей не найдены"
            />
        </div>
    );
};