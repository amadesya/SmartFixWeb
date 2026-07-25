import React, { useMemo } from 'react';
import { EmployeeDto } from '@/services/api';
import DataTable, { Column } from '@/components/ui/DataTable';
import { PencilIcon, TrashIcon } from '../ui/icons';

interface EmployeesTableProps {
    employees: EmployeeDto[];
    onDelete: (id: number) => void;
    onEdit: (emp: EmployeeDto) => void; // Добавили функцию для редактирования
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, onDelete, onEdit }) => {
    const columns = useMemo<Column<EmployeeDto>[]>(() => [
        {
            header: 'ID',
            render: (emp) => <span className=" text-smartfix-darker dark:text-white">{emp.id}</span>
        },
        {
            header: 'Имя',
            render: (emp) => <span className="font-bold  text-smartfix-darker dark:text-white">{emp.userName}</span>
        },
        {
            header: 'Роль',
            render: (emp) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors cursor-default ${emp.userRole === 1
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/70 hover:text-blue-900 dark:hover:text-blue-100'
                    : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/70 hover:text-green-900 dark:hover:text-green-100'
                    }`}>
                    {emp.userRole === 1 ? 'Мастер' : 'Админ'}
                </span>
            )
        },
        {
            header: 'Оклад',
            render: (emp) => <span className="font-bold  text-smartfix-darker dark:text-white">{emp.baseSalary.toLocaleString('ru-RU')} ₽</span>
        },
        {
            header: 'Премия (%)',
            render: (emp) => <span className="font-bold  text-smartfix-darker dark:text-white">{emp.bonusPercentage}%</span>
        },
        {
            header: 'Действия',
            className: 'w-10',
            render: (emp) => (
                <div className="flex justify-end items-center gap-2">
                    <button
                        onClick={() => onEdit(emp)}
                        className="bg-smartfix-darkest p-2 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(emp.id)}
                        className="bg-smartfix-darkest p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-all shadow-lg"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ], [onDelete, onEdit]); // Не забываем добавить onEdit в зависимости useMemo

    return (
        <DataTable
            data={employees}
            columns={columns}
            isLoading={false}
            rowKey={(emp) => emp.id}
            emptyMessage="Нет данных о сотрудниках."
        />
    );
};

export default EmployeesTable;