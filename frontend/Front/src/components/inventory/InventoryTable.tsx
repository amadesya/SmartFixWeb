import React from 'react';
import { Part } from '@/types';
import DataTable, { Column } from '@/components/ui/DataTable';
import { PencilIcon, TrashIcon, HistoryIcon } from '../ui/icons';

interface InventoryTableProps {
    parts: Part[];
    isLoading?: boolean; 
    onDelete: (id: number) => void;
    onEdit: (part: Part) => void;
    onShowHistory: (part: { id: number; name: string }) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
    parts,
    isLoading = false,
    onDelete,
    onEdit,
    onShowHistory
}) => {
    const columns: Column<Part>[] = [
        {
            header: 'ID',
            className: 'w-16',
            render: (part) => <span className="text-gray-900 dark:text-smartfix-lightest">{part.id}</span>
        },
        {
            header: 'Название',
            render: (part) => (
                <span className="font-medium text-gray-900 dark:text-smartfix-lightest">{part.name}</span>
            )
        },
        {
            header: 'Остаток на складе',
            className: 'w-48',
            render: (part) => <span className="text-gray-700 dark:text-smartfix-light">{part.stockQuantity}</span>
        },
        {
            header: 'Цена закупки',
            className: 'w-40',
            render: (part) => <span className="text-gray-700 dark:text-smartfix-light">{part.purchasePrice} ₽</span>
        },
        {
            header: 'Тип запчасти',
            className: 'w-40',
            render: (part) => <span className="text-gray-700 dark:text-smartfix-light">{part.type?.name || "Не указан"}</span>
        },
        {
            header: 'Действия',
            className: 'w-10',
            render: (part) => (
                <div className="flex justify-end items-center gap-2">
                    <button
                        onClick={() => onEdit(part)}
                        className="bg-gray-100 dark:bg-smartfix-darkest p-2 rounded-lg text-blue-500 dark:text-blue-400 hover:text-white dark:hover:text-white hover:bg-blue-600 transition-all shadow-sm dark:shadow-lg"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(part.id)}
                        className="bg-gray-100 dark:bg-smartfix-darkest p-2 rounded-lg text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white hover:bg-red-600 transition-all shadow-sm dark:shadow-lg"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onShowHistory({ id: part.id, name: part.name })}
                        className="bg-gray-100 dark:bg-smartfix-darkest p-2 rounded-lg text-emerald-500 dark:text-emerald-400 hover:text-white dark:hover:text-white hover:bg-emerald-600 transition-all shadow-sm dark:shadow-lg"
                        title="История перемещений"
                    >
                        <HistoryIcon className="w-4 h-4" />
                    </button>

                </div>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-smartfix-darker rounded-xl shadow-sm border border-gray-200 dark:border-smartfix-medium/30 overflow-hidden">
            <DataTable
                data={parts}
                columns={columns}
                isLoading={isLoading}
                rowKey={(part) => part.id}
                emptyMessage="Запчасти не найдены"
            />
        </div>
    );
};